import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, studentId } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const user = new UserModel({
      name,
      email,
      password,
      studentId,
      role: "student",
    });

    await user.save();

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}