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
    description: string;
    amount: number;
    date: string;
  }>;
}

interface ClubData {
  _id: string;
  name: string;
}

export default function AdminBudgetPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBudget, setExpandedBudget] = useState<string | null>(null);
  const [showAllocateForm, setShowAllocateForm] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string>("");
  const [allocationAmount, setAllocationAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchBudgets();
      fetchClubs();
    }
  }, [status, session, router]);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (response.ok) {
        const result = await response.json();
        setBudgets(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await fetch("/api/clubs");
      if (response.ok) {
        const result = await response.json();
        setClubs(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const handleAllocateBudget = async () => {
    if (!selectedClubId) {
      toast({
        title: "Error",
        description: "Please select a club",
        variant: "destructive",
      });
      return;
    }

    if (!allocationAmount || parseFloat(allocationAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubId: selectedClubId,
          allocatedAmount: parseFloat(allocationAmount),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Budget allocated successfully!",
        });
        setShowAllocateForm(false);
        setSelectedClubId("");
        setAllocationAmount("");
        fetchBudgets();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to allocate budget");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to allocate budget",
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

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const calculateTotalExpenses = (expenses: any[]) => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const calculateRemaining = (allocated: number, expenses: any[]) => {
    return allocated - calculateTotalExpenses(expenses);
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalExpenses = budgets.reduce(
    (sum, b) => sum + calculateTotalExpenses(b.expenses),
    0
  );
  const totalRemaining = totalAllocated - totalExpenses;

  // Get clubs that don't have budget allocated yet
  const clubsWithoutBudget = clubs.filter(
    (club) => !budgets.some((budget) => budget.club._id === club._id)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Budget Management</h1>
        <p className="text-gray-600">Allocate budgets to clubs and track expenditures</p>
      </div>

      {/* Allocate Budget Form */}
      <div className="mb-8">
        {!showAllocateForm ? (
          <Button onClick={() => setShowAllocateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Allocate Budget to Club
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Allocate Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Club</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedClubId}
                  onChange={(e) => setSelectedClubId(e.target.value)}
                >
                  <option value="">-- Select a club --</option>
                  {clubs.map((club) => {
                    const hasBudget = budgets.some((b) => b.club._id === club._id);
                    return (
                      <option key={club._id} value={club._id}>
                        {club.name} {hasBudget ? "(Budget already allocated)" : ""}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {clubsWithoutBudget.length} club(s) without budget allocation
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="e.g., 50000"
                  value={allocationAmount}
                  onChange={(e) => setAllocationAmount(e.target.value)}
                  min="0"
                  step="1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the budget amount to allocate to the club
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAllocateBudget} disabled={submitting}>
                  {submitting ? "Allocating..." : "Allocate Budget"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAllocateForm(false);
                    setSelectedClubId("");
                    setAllocationAmount("");
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Allocated
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalAllocated.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Across all clubs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Remaining
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{totalRemaining.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      {budgets.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No budgets allocated yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {budgets.map((budget) => {
            const totalExpense = calculateTotalExpenses(budget.expenses);
            const remaining = calculateRemaining(budget.allocatedAmount, budget.expenses);
            const percentageUsed = (totalExpense / budget.allocatedAmount) * 100;

            return (
              <Card key={budget._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3">
                        {budget.club?.name || "Unknown Club"}
                      </CardTitle>
                      
                      {/* Budget Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Allocated:</span>
                          <span className="font-semibold">
                            ₹{budget.allocatedAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Spent:</span>
                          <span className="font-semibold text-red-600">
                            ₹{totalExpense.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining:</span>
                          <span className="font-semibold text-green-600">
                            ₹{remaining.toLocaleString()}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                percentageUsed > 90
                                  ? "bg-red-600"
                                  : percentageUsed > 70
                                  ? "bg-yellow-600"
                                  : "bg-green-600"
                              }`}
                              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {percentageUsed.toFixed(1)}% utilized
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedClubId(budget.club._id);
                          setAllocationAmount(budget.allocatedAmount.toString());
                          setShowAllocateForm(true);
                        }}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Budget
                      </button>
                      <button
                        onClick={() =>
                          setExpandedBudget(expandedBudget === budget._id ? null : budget._id)
                        }
                        className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        {expandedBudget === budget._id ? "Hide Expenses" : "View Expenses"}
                      </button>
                    </div>
                  </div>
                </CardHeader>

                {/* Expenses List */}
                {expandedBudget === budget._id && (
                  <CardContent>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-sm text-gray-700">
                        Expense History ({budget.expenses.length})
                      </h4>
                      {budget.expenses.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No expenses recorded yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {budget.expenses.map((expense, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-sm">{expense.description}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(expense.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-red-600">
                                  -₹{expense.amount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}