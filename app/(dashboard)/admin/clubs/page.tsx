"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ClubData {
  _id: string;
  name: string;
  description: string;
  coordinator: {
    _id: string;
    name: string;
    email: string;
  };
  memberCount: number;
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  createdAt: string;
}

export default function AdminClubsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClub, setExpandedClub] = useState<string | null>(null);

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
      fetchClubs();
    }
  }, [status, session, router]);

  const fetchClubs = async () => {
    try {
      const response = await fetch("/api/admin/clubs");
      if (response.ok) {
        const result = await response.json();
        setClubs(result.data);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
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

  const totalMembers = clubs.reduce((sum, club) => sum + club.memberCount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Club Management</h1>
        <p className="text-gray-600">
          View club statistics and member details
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Clubs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clubs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMembers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Across all clubs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clubs List */}
      {clubs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No clubs found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {clubs.map((club) => (
            <Card key={club._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{club.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-3">{club.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span>Coordinator: {club.coordinator?.name || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{club.memberCount} members</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedClub(expandedClub === club._id ? null : club._id)}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {expandedClub === club._id ? "Hide Members" : "View Members"}
                  </button>
                </div>
              </CardHeader>
              
              {expandedClub === club._id && club.members && club.members.length > 0 && (
                <CardContent>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 text-sm text-gray-700">
                      Club Members ({club.memberCount})
                    </h4>
                    <div className="grid gap-2">
                      {club.members.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}