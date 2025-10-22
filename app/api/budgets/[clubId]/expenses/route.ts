import dbConnect from "@/lib/dbConnect";
import BudgetModel from "@/models/budget.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

/**
 * POST: add an expense to a club budget
 * body: { description, amount, date? }
 */

export async function POST(request: Request, { params }: { params: Promise<{ clubId: string }> }) {
  try {
    const { clubId } = await params;
    const body = await request.json();
    const { description, amount, date } = body;

    if (!description || amount === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(clubId)) {
      return NextResponse.json({ error: "Invalid club id" }, { status: 400 });
    }

    await dbConnect();

    const budget = await BudgetModel.findOne({ club: clubId });
    if (!budget) {
      return NextResponse.json({ error: "Budget not found for this club" }, { status: 404 });
    }

    const expense = {
      description,
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
    };

    budget.expenses.push(expense);
    await budget.save();

    return NextResponse.json({ message: "Expense logged", budget }, { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets/[clubId]/expenses error:", error);
    return NextResponse.json({ error: "Failed to log expense" }, { status: 500 });
  }
}