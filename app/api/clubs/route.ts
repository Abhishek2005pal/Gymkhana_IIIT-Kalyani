import dbConnect from "@/lib/dbConnect";
import ClubModel from "@/models/club.model";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

/**
 * GET: list clubs (public)
 * POST: create club (admin only) - expects coordinatorId and club details
 */

export async function GET() {
  try {
    await dbConnect();
    const clubs = await ClubModel.find()
      .populate("coordinator", "name email")
      .select("name description logoUrl coordinator members createdAt updatedAt")
      .lean();
    return NextResponse.json({ data: clubs });
  } catch (error) {
    console.error("GET /api/clubs error:", error);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, logoUrl, coordinatorId } = body;

    if (!name || !description || !coordinatorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const coordinator = await UserModel.findById(coordinatorId);
    if (!coordinator) {
      return NextResponse.json({ error: "Coordinator not found" }, { status: 404 });
    }

    const existing = await ClubModel.findOne({ name });
    if (existing) {
      return NextResponse.json({ error: "Club name already exists" }, { status: 409 });
    }

    const club = new ClubModel({
      name,
      description,
      logoUrl,
      coordinator: coordinator._id,
      members: coordinator ? [coordinator._id] : [],
    });

    await club.save();

    return NextResponse.json({ message: "Club created", club }, { status: 201 });
  } catch (error) {
    console.error("POST /api/clubs error:", error);
    return NextResponse.json({ error: "Failed to create club" }, { status: 500 });
  }
}