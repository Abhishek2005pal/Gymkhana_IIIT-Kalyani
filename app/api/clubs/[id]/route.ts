import dbConnect from "@/lib/dbConnect";
import ClubModel from "@/models/club.model";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid club id" }, { status: 400 });
    }
    await dbConnect();
    const club = await ClubModel.findById(id)
      .populate("coordinator", "name email role")
      .populate("members", "name email studentId")
      .lean();
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }
    return NextResponse.json({ club });
  } catch (error) {
    console.error("GET /api/clubs/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Update club details (admin or coordinator)
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, logoUrl, coordinatorId, memberIds } = body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid club id" }, { status: 400 });
    }

    await dbConnect();

    const club = await ClubModel.findById(id);
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    if (name) club.name = name;
    if (description) club.description = description;
    if (logoUrl !== undefined) club.logoUrl = logoUrl;
    if (coordinatorId) {
      const coord = await UserModel.findById(coordinatorId);
      if (!coord) return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
      club.coordinator = coord._id;
    }
    if (Array.isArray(memberIds)) {
      club.members = memberIds.map((m: string) => new mongoose.Types.ObjectId(m));
    }

    await club.save();

    return NextResponse.json({ message: "Club updated", club });
  } catch (error) {
    console.error("PUT /api/clubs/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid club id" }, { status: 400 });
    }

    await dbConnect();
    const club = await ClubModel.findById(id);
    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

    await club.deleteOne();

    return NextResponse.json({ message: "Club deleted" });
  } catch (error) {
    console.error("DELETE /api/clubs/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}