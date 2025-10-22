import dbConnect from "@/lib/dbConnect";
import EventModel from "@/models/event.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * GET: get event by id
 * PUT: update event (coordinator/admin)
 * DELETE: delete event
 * PATCH: used for approve/reject (admin) - expects { action: 'approve'|'reject' }
 */

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
    }
    await dbConnect();
    const event = await EventModel.findById(id).populate("club", "name logoUrl").populate("registeredUsers", "name email studentId").lean();
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ event });
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
    }
    await dbConnect();
    const event = await EventModel.findById(id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const updatable = ["title", "description", "date", "location", "registrationLimit", "status"];
    updatable.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        // @ts-ignore
        event[k] = body[k];
      }
    });

    if (body.date) event.date = new Date(body.date);

    await event.save();
    return NextResponse.json({ message: "Event updated", event });
  } catch (error) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
    }
    await dbConnect();
    const event = await EventModel.findById(id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    await event.deleteOne();

    return NextResponse.json({ message: "Event deleted" });
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // approve or reject

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event id" }, { status: 400 });
    }

    await dbConnect();
    const event = await EventModel.findById(id);
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    event.status = action === "approve" ? "approved" : "rejected";
    await event.save();

    return NextResponse.json({ message: `Event ${event.status}` });
  } catch (error) {
    console.error("PATCH /api/events/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}