import { getAllChannels, addChannel, updateChannel, deleteChannel } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

// GET all channels
export async function GET() {
  try {
    const channels = getAllChannels();
    return NextResponse.json({ success: true, data: channels });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}

// POST create new channel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, channelId, description, icon } = body;

    if (!name || !channelId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name and channelId" },
        { status: 400 }
      );
    }

    const channel = addChannel({
      name,
      channelId,
      description: description || "",
      icon: icon || "",
    });

    return NextResponse.json({ success: true, data: channel }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create channel" },
      { status: 500 }
    );
  }
}
