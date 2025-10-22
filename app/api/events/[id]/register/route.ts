import dbConnect from "@/lib/dbConnect";
import EventModel from "@/models/event.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * POST: register user for event (requires userId in body)
 */

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - user ID required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
    }

    await dbConnect();

    const event = await EventModel.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "approved") {
      return NextResponse.json(
        { error: "Event is not open for registration" },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const already = event.registeredUsers.some((u: any) => u.equals(userObjectId));

    if (already) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 }
      );
    }

    if (event.registrationLimit && event.registeredUsers.length >= event.registrationLimit) {
      return NextResponse.json(
        { error: "Registration limit reached" },
        { status: 400 }
      );
    }

    event.registeredUsers.push(userObjectId);
    await event.save();

    return NextResponse.json({
      message: "Successfully registered for event",
      registeredUsers: event.registeredUsers,
    });
  } catch (error) {
    console.error("POST /api/events/[id]/register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}