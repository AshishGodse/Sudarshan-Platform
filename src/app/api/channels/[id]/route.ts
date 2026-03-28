import { updateChannel, deleteChannel, getChannelById } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

// PUT update channel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateChannel(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Channel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update channel" },
      { status: 500 }
    );
  }
}

// DELETE channel
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteChannel(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Channel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Channel deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete channel" },
      { status: 500 }
    );
  }
}

// GET single channel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const channel = getChannelById(id);

    if (!channel) {
      return NextResponse.json(
        { success: false, error: "Channel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: channel });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch channel" },
      { status: 500 }
    );
  }
}
