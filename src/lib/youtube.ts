/**
 * YouTube API utility for fetching live streams from channels
 */

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export interface YouTubeLiveStream {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelName: string;
  isLive: boolean;
  viewCount?: string;
  publishedAt: string;
  stats?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export interface DarshanChannel {
  id: string;
  name: string;
  channelId: string;
  description: string;
  icon?: string;
}

/**
 * Search for live streams from a specific YouTube channel
 * @param channelId - YouTube Channel ID
 * @returns Current live stream or most recent video
 */
export async function fetchChannelLiveStream(
  channelId: string
): Promise<YouTubeLiveStream | null> {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key not configured");
    }

    // First, search for live streams from the channel
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("channelId", channelId);
    searchUrl.searchParams.append("eventType", "live");
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("key", YOUTUBE_API_KEY);
    searchUrl.searchParams.append("maxResults", "1");
    searchUrl.searchParams.append("order", "date");

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        channelName: item.snippet.channelTitle,
        isLive: true,
        publishedAt: item.snippet.publishedAt,
      };
    }

    // If no live stream, fetch the latest video
    const recentUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    recentUrl.searchParams.append("part", "snippet");
    recentUrl.searchParams.append("channelId", channelId);
    recentUrl.searchParams.append("type", "video");
    recentUrl.searchParams.append("key", YOUTUBE_API_KEY);
    recentUrl.searchParams.append("maxResults", "1");
    recentUrl.searchParams.append("order", "date");

    const recentResponse = await fetch(recentUrl.toString());
    const recentData = await recentResponse.json();

    if (recentData.items && recentData.items.length > 0) {
      const item = recentData.items[0];
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        channelName: item.snippet.channelTitle,
        isLive: false,
        publishedAt: item.snippet.publishedAt,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching live stream:", error);
    return null;
  }
}

/**
 * Get video statistics (view count, like count, etc.)
 */
export async function getVideoStats(videoId: string) {
  try {
    if (!YOUTUBE_API_KEY) {
      throw new Error("YouTube API key not configured");
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.append("part", "statistics");
    url.searchParams.append("id", videoId);
    url.searchParams.append("key", YOUTUBE_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].statistics;
    }

    return null;
  } catch (error) {
    console.error("Error fetching video stats:", error);
    return null;
  }
}
