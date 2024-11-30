//type.ts

export interface Participant {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Poster {
  name: string;
  age?: number;
  connection: "1st" | "2nd" | "3rd";
}

export interface Event {
  title: string;
  description: string;
  time?: string;
  location: string;
  currentInterested: number;
  openInvite: boolean;
  totalSpots: number;
  participants: Participant[];
  startTime?: number;
  duration?: number;
  originalPoster?: Poster;
}

export interface FeedItem {
  id: number;
  type: "scheduled" | "realtime" | "repost";
  poster: Poster;
  event: Event;
  repostMessage?: string;
}

export interface EventLocation {
  name: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface EventData {
  title: string;
  datetime: string;
  location: EventLocation;
  description?: string;
  capacity?: number;
  type?: "social" | "business" | "entertainment";
}

export interface EditableEventData extends EventData {
  isEditing?: boolean;
}

export interface CustomPlaylist {
  id: number;
  title: string;
  description: string;
  items: FeedItem[];
}

export interface ProfilePhoto {
  id: string;
  url: string | null;
  order: number;
}

export interface ProfileBlurb {
  id: string;
  prompt: string;
  response: string;
}

export interface ProfileStats {
  flakeScore: number;
  friendCount: number;
  status: string;
}

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: ProfilePhoto[];
  blurbs: ProfileBlurb[];
  joinDate: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  stats: ProfileStats;
}