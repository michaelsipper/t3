//feed-card.tsx

"use client";
import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Send, Repeat, MoreVertical, Trash2 } from "lucide-react";
import { TimeProgressBar } from "./time-progress-bar";
import { ParticipantsDisplay } from "./participants-display";
import type { FeedItem } from "@/lib/types";

interface FeedCardProps {
  item: FeedItem;
  onInterestToggle: (id: number) => void;
  onRepostToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isInterested: boolean;
  isReposted: boolean;
}

export function FeedCard({
  item,
  onInterestToggle,
  onRepostToggle,
  onDelete,
  isInterested,
  isReposted,
}: FeedCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
      {/* Menu Button */}
      <div className="absolute top-4 right-4 z-10" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => {
                onDelete(item.id);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Plan
            </button>
          </div>
        )}
      </div>

      {/* Repost Header */}
      {item.type === "repost" && (
        <>
          <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Repeat className="w-4 h-4" />
              <span className="text-sm">
                Reposted by{" "}
                <span className="text-black dark:text-white font-medium">
                  {item.poster.name}
                </span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400">
                1st
              </span>
            </div>
          </div>

          {/* Repost Comment */}
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              who wants to do this with me?
            </p>
          </div>

          {/* Repost Actions */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-4">
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}

      <div className="p-4">
        {/* Time Progress Bar for Realtime Events */}
        {item.type === "realtime" && (
          <div className="mb-4">
            <TimeProgressBar
              startTime={item.event.startTime!}
              duration={item.event.duration!}
            />
          </div>
        )}

        {/* Original Post Content */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-white dark:text-black font-medium">
            {
              (item.type === "repost"
                ? item.event.originalPoster?.name
                : item.poster.name)?.[0]
            }
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-black dark:text-white">
                {item.type === "repost"
                  ? item.event.originalPoster?.name
                  : item.poster.name}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.type === "repost"
                  ? item.event.originalPoster?.age
                  : item.poster.age}
              </span>
              <span
                className={`
                text-xs px-2 py-0.5 rounded-lg 
                ${
                  (item.type === "repost"
                    ? item.event.originalPoster?.connection
                    : item.poster.connection) === "1st"
                    ? "bg-emerald-100 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
                    : (item.type === "repost"
                        ? item.event.originalPoster?.connection
                        : item.poster.connection) === "2nd"
                    ? "bg-sky-100 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }
              `}
              >
                {item.type === "repost"
                  ? item.event.originalPoster?.connection
                  : item.poster.connection}
              </span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
            {item.event.title}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
            {item.event.description}
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>{item.event.time}</span>
            <span>•</span>
            <span>{item.event.location}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="py-3 border-t border-zinc-200 dark:border-zinc-800">
          <ParticipantsDisplay
            totalSpots={item.event.totalSpots}
            participants={item.event.participants}
            remainingSpots={
              item.event.totalSpots - item.event.participants.length
            }
            showNames={item.poster.connection === "1st"}
            openInvite={item.event.openInvite}
          />
        </div>

        {/* Original Post Actions */}
        {item.type !== "repost" && (
          <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex gap-4">
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </button>
              {item.event.openInvite && (
                <button
                  onClick={() => onRepostToggle(item.id)}
                  className={`transition-colors ${
                    isReposted
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {item.event.currentInterested > 0 && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {item.event.currentInterested} interested
                </span>
              )}
              <button
                onClick={() => onInterestToggle(item.id)}
                className={`
                  px-4 py-1.5 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${
                    isInterested
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700"
                      : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                  }
                `}
              >
                {isInterested ? "Interested" : "Join"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}