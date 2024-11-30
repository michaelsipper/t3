// app/(features)/inbox/messages/messages.tsx
"use client";

import { useState } from 'react';
import { ArrowLeft, MoreVertical, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

export default function Messages() {
  const router = useRouter();
  const [messages] = useState<Message[]>([
    {
      id: 1,
      name: "Sarah Chen",
      lastMessage: "See you there!",
      time: "2m",
      unread: true
    },
    {
      id: 2,
      name: "Alex Kumar",
      lastMessage: "Thanks for the invite",
      time: "1h",
      unread: false
    },
    {
      id: 3,
      name: "Beach Volleyball Group",
      lastMessage: "Michael: What time tomorrow?",
      time: "3h",
      unread: true
    }
  ]);

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()}
                className="text-black dark:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-black dark:text-white">
                Messages
              </h1>
            </div>
            <button className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search messages"
                className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {messages.map(message => (
            <div 
              key={message.id}
              className="flex items-center gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-white">
                {message.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium dark:text-white truncate">{message.name}</h3>
                  <span className="text-xs text-zinc-500">{message.time}</span>
                </div>
                <p className={`text-sm truncate ${
                  message.unread 
                    ? "text-zinc-900 dark:text-zinc-100 font-medium" 
                    : "text-zinc-500 dark:text-zinc-400"
                }`}>
                  {message.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
