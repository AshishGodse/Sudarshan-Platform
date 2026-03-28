/**
 * Local storage utilities for managing Darshan channels
 */

import fs from "fs";
import path from "path";

export interface DarshanChannel {
  id: string;
  name: string;
  channelId: string; // YouTube Channel ID
  description: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const CHANNELS_FILE = path.join(DATA_DIR, "channels.json");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Get all channels
export function getAllChannels(): DarshanChannel[] {
  try {
    ensureDataDir();
    if (fs.existsSync(CHANNELS_FILE)) {
      const data = fs.readFileSync(CHANNELS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading channels:", error);
  }
  return [];
}

// Get single channel by ID
export function getChannelById(id: string): DarshanChannel | null {
  const channels = getAllChannels();
  return channels.find((ch) => ch.id === id) || null;
}

// Add new channel
export function addChannel(channel: Omit<DarshanChannel, "id" | "createdAt" | "updatedAt">): DarshanChannel {
  ensureDataDir();
  const channels = getAllChannels();

  const newChannel: DarshanChannel = {
    ...channel,
    id: `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  channels.push(newChannel);
  fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2));

  return newChannel;
}

// Update channel
export function updateChannel(id: string, updates: Partial<DarshanChannel>): DarshanChannel | null {
  ensureDataDir();
  const channels = getAllChannels();
  const index = channels.findIndex((ch) => ch.id === id);

  if (index === -1) return null;

  channels[index] = {
    ...channels[index],
    ...updates,
    id: channels[index].id, // Don't allow ID change
    createdAt: channels[index].createdAt, // Don't allow createdAt change
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channels, null, 2));

  return channels[index];
}

// Delete channel
export function deleteChannel(id: string): boolean {
  ensureDataDir();
  const channels = getAllChannels();
  const filtered = channels.filter((ch) => ch.id !== id);

  if (filtered.length === channels.length) return false;

  fs.writeFileSync(CHANNELS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
