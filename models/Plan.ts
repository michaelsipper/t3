import { ObjectId } from "mongodb";

export interface Plan {
  _id?: ObjectId; // Automatically generated by MongoDB
  title: string; // Title of the plan
  description?: string; // Optional description of the plan
  location: {
    name: string;
    address?: string; // Optional address for the location
  };
  datetime?: Date; // Date and time for the plan (ISO format)
  duration?: number; // Duration in hours for Type 2 plans
  type: "social" | "business" | "entertainment"; // Type of plan
  createdBy: string; // User ID or email of the creator
  participants?: Array<{ id: string; name: string }>; // List of attendees (optional)
  createdAt: Date; // Plan creation date
}
