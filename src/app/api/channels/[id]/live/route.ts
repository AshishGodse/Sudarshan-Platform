import { fetchChannelLiveStream, getVideoStats } from "@/lib/youtube";
import { getChannelById } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

// GET live stream for a specific channel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get channel from database
    const channel = getChannelById(id);
    if (!channel) {
      return NextResponse.json(
        { success: false, error: "Channel not found" },
        { status: 404 }
      );
    }

    // Fetch live stream from YouTube
    const liveStream = await fetchChannelLiveStream(channel.channelId);

    if (!liveStream) {
      return NextResponse.json(
        { success: false, error: "No live stream found for this channel" },
        { status: 404 }
      );
    }

    // Get additional stats if available
    const stats = await getVideoStats(liveStream.videoId);

    return NextResponse.json({
      success: true,
      data: {
        ...liveStream,
        stats: stats,
      },
    });
  } catch (error) {
    console.error("Error fetching live stream:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch live stream" },
      { status: 500 }
    );
  }
}
