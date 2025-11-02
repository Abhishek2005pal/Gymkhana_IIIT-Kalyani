"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface BudgetData {
  _id: string;
  club: {
    _id: string;
    name: string;
  };
  allocatedAmount: number;
  expenses: Array<{
    _id?: string;
    description: string;
    amount: number;
    date: string;
  }>;
}

export default function CoordinatorBudgetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "coordinator") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "coordinator") {
      fetchBudget();
    }
  }, [status, session, router]);

  const fetchBudget = async () => {
    try {
      // First, find the club where the user is coordinator
      const clubsResponse = await fetch("/api/clubs");
      if (!clubsResponse.ok) throw new Error("Failed to fetch clubs");
      
      const clubsResult = await clubsResponse.json();
      const myClub = clubsResult.data.find(
        (club: any) => club.coordinator._id === session?.user?.id
      );

      if (!myClub) {
        setLoading(false);
        return;
      }

      // Fetch budget for this club
      const budgetResponse = await fetch("/api/budgets");
      if (!budgetResponse.ok) throw new Error("Failed to fetch budget");
      
      const budgetResult = await budgetResponse.json();
      const myBudget = budgetResult.data.find(
        (b: any) => b.club._id === myClub._id
      );

      setBudget(myBudget || null);
    } catch (error) {
      console.error("Error fetching budget:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseDescription || !expenseAmount || parseFloat(expenseAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please fill all fields with valid values",
        variant: "destructive",
      });
      return;
    }

    if (!budget) {
      toast({
        title: "Error",
        description: "No budget allocated for your club",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/budgets/${budget.club._id}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: expenseDescription,
          amount: parseFloat(expenseAmount),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Expense added successfully!",
        });
        setShowAddExpense(false);
        setExpenseDescription("");
        setExpenseAmount("");
        fetchBudget();
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "coordinator") {
    return null;
  }

  if (!budget) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Budget Management</h1>
          <p className="text-gray-600">View your club's budget and manage expenses</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-2">No budget allocated for your club yet.</p>
            <p className="text-sm text-gray-400">
              Please contact the admin to allocate a budget.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalExpenses = budget.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = budget.allocatedAmount - totalExpenses;
  const percentageUsed = (totalExpenses / budget.allocatedAmount) * 100;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Budget Management</h1>
        <p className="text-gray-600">{budget.club.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Allocated Budget
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{budget.allocatedAmount.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total allocation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ₹{totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {percentageUsed.toFixed(1)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Remaining</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{remaining.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">Budget Utilization</span>
            <span>{percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                percentageUsed > 90
                  ? "bg-red-600"
                  : percentageUsed > 70
                  ? "bg-yellow-600"
                  : "bg-green-600"
              }`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Form */}
      <div className="mb-6">
        {!showAddExpense ? (
          <Button onClick={() => setShowAddExpense(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  type="text"
                  placeholder="e.g., Event supplies, equipment purchase"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddExpense} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Expense"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddExpense(false);
                    setExpenseDescription("");
                    setExpenseAmount("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
        </CardHeader>
        <CardContent>
          {budget.expenses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No expenses recorded yet</p>
          ) : (
            <div className="space-y-2">
              {budget.expenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600 text-lg">
                        -₹{expense.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
