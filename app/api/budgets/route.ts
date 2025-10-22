import dbConnect from "@/lib/dbConnect";
import BudgetModel from "@/models/budget.model";
import ClubModel from "@/models/club.model";
import { NextResponse } from "next/server";

/**
 * GET: list all budgets
 * POST: allocate/assign budget to club (admin)
 * body: { clubId, allocatedAmount }
 */

export async function GET() {
  try {
    await dbConnect();
    const budgets = await BudgetModel.find().populate("club", "name").lean();
    return NextResponse.json({ data: budgets });
  } catch (error) {
    console.error("GET /api/budgets error:", error);
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clubId, allocatedAmount } = body;
    if (!clubId || allocatedAmount === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    const club = await ClubModel.findById(clubId);
    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

    let budget = await BudgetModel.findOne({ club: clubId });
    if (!budget) {
      budget = new BudgetModel({ club: clubId, allocatedAmount, expenses: [] });
    } else {
      budget.allocatedAmount = allocatedAmount;
    }

    await budget.save();

    return NextResponse.json({ message: "Budget allocated", budget }, { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets error:", error);
    return NextResponse.json({ error: "Failed to allocate budget" }, { status: 500 });
  }
}