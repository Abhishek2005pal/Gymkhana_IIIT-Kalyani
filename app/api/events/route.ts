import dbConnect from "@/lib/dbConnect";
import EventModel from "@/models/event.model";
import { NextResponse } from "next/server";

/**
 * GET: fetch approved upcoming events (or accept query to include pending)
 * POST: create event (coordinator) -> default status pending
 */

export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const club = url.searchParams.get("club");
    const userId = url.searchParams.get("userId");
    const query: any = {};

    // If userId is provided, fetch events registered by that user
    if (userId) {
      const events = await EventModel.find({ registeredUsers: userId })
        .populate("club", "name logoUrl")
        .sort({ date: 1 })
        .lean();
      return NextResponse.json({ data: events });
    }

    // Otherwise, fetch events with filters
    if (status) {
      query.status = status;
    } else {
      query.status = "approved"; // default to approved
    }
    
    if (club) query.club = club;

    // default: upcoming (date >= now)
    const now = new Date();
    const events = await EventModel.find({
      ...query,
      date: { $gte: now },
    })
      .populate("club", "name logoUrl")
      .sort({ date: 1 })
      .lean();

    return NextResponse.json({ data: events });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, clubId, date, location, registrationLimit } = body;

    if (!title || !description || !clubId || !date || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const event = new EventModel({
      title,
      description,
      club: clubId,
      date: new Date(date),
      location,
      registrationLimit,
      status: "pending",
    });

    await event.save();

    return NextResponse.json({ message: "Event created and pending approval", event }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}