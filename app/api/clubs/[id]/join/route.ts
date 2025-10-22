import dbConnect from "@/lib/dbConnect";
import ClubModel from "@/models/club.model";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get session from request body for now (client will send it)
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - user ID required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await dbConnect();

    const club = await ClubModel.findById(id);
    if (!club) {
      return NextResponse.json(
        { error: "Club not found" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isMember = club.members.some(
      (memberId: any) => memberId.toString() === userId
    );

    if (isMember) {
      return NextResponse.json(
        { error: "You are already a member of this club" },
        { status: 400 }
      );
    }

    // Add user to club members
    club.members.push(userId as any);
    await club.save();

    return NextResponse.json({
      message: "Successfully joined the club",
      club,
    });
  } catch (error) {
    console.error("Join club error:", error);
    return NextResponse.json(
      { error: "Failed to join club" },
      { status: 500 }
    );
  }
}
