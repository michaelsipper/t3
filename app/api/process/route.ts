// app/api/process/route.ts
import { NextResponse } from 'next/server';
import vision from '@google-cloud/vision';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

if (!process.env.GOOGLE_CLOUD_PROJECT_ID || 
    !process.env.GOOGLE_CLOUD_PRIVATE_KEY || 
    !process.env.GOOGLE_CLOUD_CLIENT_EMAIL || 
    !process.env.OPENAI_API_KEY) {
  throw new Error('Some required environment variables are missing');
}

const visionClient = new vision.ImageAnnotatorClient({
  credentials: {
    project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    private_key: (process.env.GOOGLE_CLOUD_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchUrlContent(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout after 8 seconds

  try {
    const response = await fetch(url, { signal: controller.signal });
    const html = await response.text();
    const $ = cheerio.load(html);

    $('script').remove();
    $('style').remove();

    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').text();
    const mainContent = $('main').text() || $('article').text() || $('body').text();

    return `
      Title: ${title}
      Description: ${metaDescription}
      Heading: ${h1}
      Content: ${mainContent.substring(0, 1000)}
    `.trim();
  } catch (error) {
    console.error('Error fetching URL content:', error);
    throw new Error('Timeout fetching URL content');
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseDateTimeString(dateTimeString: string | undefined): string | null {
  if (!dateTimeString) return null;
  try {
    const date = new Date(dateTimeString);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch (error) {
    console.error('Date parsing error:', error);
    return null;
  }
}

export async function POST(req: Request) {
  console.log('API endpoint hit for event processing');

  try {
    const formData = await req.formData();
    const url = formData.get('url') as string | null;
    const file = formData.get('image') as File | null;

    let extractedText = '';

    if (url) {
      console.log('Processing URL:', url);
      extractedText = await fetchUrlContent(url);
    }

    if (file) {
      console.log('Processing file:', file.name);
      const buffer = Buffer.from(await file.arrayBuffer());
      const [result] = await visionClient.textDetection(buffer);
      const detections = result.textAnnotations;
      extractedText = detections && detections[0].description ? detections[0].description : '';
    }

    if (!extractedText) {
      return NextResponse.json({ error: 'No text extracted' }, { status: 400 });
    }

    console.log('Extracted text:', extractedText);

    const systemPrompt = `Extract the event details from the text in JSON format with these fields:
    - title (string)
    - datetime (string in ISO format if possible, otherwise a readable date)
    - location (an object with name and optional address)
    - description (string)
    - type (either "social", "business", or "entertainment")`;

    type OpenAIResponse = {
      choices: {
        message?: {
          content?: string | null; // Adjusted to allow `null`
        };
      }[];
    };

    const response: OpenAIResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: extractedText },
      ],
      max_tokens: 500,
    });

    const gptContent = response.choices[0]?.message?.content || '{}';

    let eventData;
    try {
      if (gptContent.trim().startsWith('{') || gptContent.trim().startsWith('[')) {
        eventData = JSON.parse(gptContent);
      } else {
        throw new Error('OpenAI response is not in JSON format');
      }
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      console.log('OpenAI response content:', gptContent);
      return NextResponse.json({ error: 'Error parsing response from OpenAI' }, { status: 500 });
    }

    const formattedData = {
      title: eventData.title || "Unnamed Event",
      datetime: parseDateTimeString(eventData.datetime),
      location: eventData.location || { name: "Unknown Location" },
      description: eventData.description || "",
      type: eventData.type || "social",
    };

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("tapdin");
    const plansCollection = db.collection("plans");
    const result = await plansCollection.insertOne({
      ...formattedData,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}



export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("tapdin");
    const plansCollection = db.collection("plans");

    // Retrieve all plans
    const plans = await plansCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(plans, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("tapdin");
    const plansCollection = db.collection("plans");

    const result = await plansCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}
