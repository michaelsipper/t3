//feed.tsx

'use client';
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { FeedCard } from "@/components/shared/feed-card";
import { ThemeMenu } from '@/components/shared/theme-menu';
import { useAppContext } from "@/components/shared/AppContext";

type TimeFilter = "all" | "now" | "later";
type ConnectionType = "friends" | "mutuals" | "community";

export function Feed() {
  const [activeTab, setActiveTab] = useState<ConnectionType>("friends");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [repostedItems, setRepostedItems] = useState<Set<number>>(new Set());

  const { 
    interestedItems, 
    addInterestedItem, 
    removeInterestedItem, 
    feedItems,
    deleteFeedItem
  } = useAppContext();

  const tabs: ConnectionType[] = ["friends", "mutuals", "community"];

  const toggleInterest = (itemId: number) => {
    if (interestedItems.some((item) => item.id === itemId)) {
      removeInterestedItem(itemId);
    } else {
      const item = feedItems.find((feedItem) => feedItem.id === itemId);
      if (item) addInterestedItem(item);
    }
  };

  const toggleRepost = (itemId: number) => {
    setRepostedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getFilteredItems = () => {
    console.log('Current feed items:', feedItems);
    let filtered = [...feedItems];

    console.log('Current active tab:', activeTab);
    switch (activeTab) {
      case "friends":
        filtered = filtered.filter((item) => item.poster.connection === "1st");
        break;
      case "mutuals":
        filtered = filtered.filter((item) => item.poster.connection === "2nd");
        break;
      case "community":
        filtered = filtered.filter((item) => item.poster.connection === "3rd");
        break;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.event.title.toLowerCase().includes(query) ||
          item.event.description.toLowerCase().includes(query) ||
          item.event.location.toLowerCase().includes(query) ||
          item.poster.name.toLowerCase().includes(query)
      );
    }

    switch (timeFilter) {
      case "now":
        filtered = filtered.filter((item) => item.type === "realtime");
        break;
      case "later":
        filtered = filtered.filter((item) => item.type === "scheduled");
        break;
    }

    console.log('Filtered items:', filtered);
    return filtered;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-10">
        <div className="relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-lg mx-auto px-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between py-4">
              <button onClick={() => setShowSearch(!showSearch)}>
                <Search className="w-5 h-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors" />
              </button>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
                Tap'dIn
              </h1>
              <button onClick={() => setMenuOpen(true)}>
                <Menu className="w-5 h-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors" />
              </button>
            </div>

            {/* Search Bar */}
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${showSearch ? "max-h-16 opacity-100 mb-4" : "max-h-0 opacity-0"}
            `}>
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center px-3">
                <Search className="w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search plans, people, places..."
                  className="w-full px-3 py-2 bg-transparent text-zinc-900 dark:text-white text-sm placeholder:text-zinc-500 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 pb-4">
              {/* Connection Type Scroll */}
              <div className="flex gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-4 py-1.5 rounded-lg text-sm font-medium flex-1
                      transition-colors duration-200
                      ${
                        activeTab === tab
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Time Filter Pills */}
              <div className="flex justify-end">
                <div className="inline-flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
                  {["all", "now", "later"].map((time) => (
                    <button
                      key={time}
                      onClick={() => setTimeFilter(time as TimeFilter)}
                      className={`
                        px-4 py-1.5 rounded-lg text-sm font-medium
                        transition-colors duration-200
                        ${
                          timeFilter === time
                            ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        }
                      `}
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="space-y-6">
          {getFilteredItems().map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onInterestToggle={() => toggleInterest(item.id)}
              onRepostToggle={() => toggleRepost(item.id)}
              onDelete={deleteFeedItem}
              isInterested={interestedItems.some(
                (interestedItem) => interestedItem.id === item.id
              )}
              isReposted={repostedItems.has(item.id)}
            />
          ))}
        </div>
      </main>

      <ThemeMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}