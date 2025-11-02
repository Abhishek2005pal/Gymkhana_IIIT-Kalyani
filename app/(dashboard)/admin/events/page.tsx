"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Calendar, MapPin, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EventData {
  _id: string;
  title: string;
  description: string;
  club: {
    _id: string;
    name: string;
  };
  date: string;
  location: string;
  status: string;
  registeredCount: number;
  registeredUsers: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  registrationLimit?: number;
  createdAt: string;
}

export default function AdminEventsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

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
      fetchEvents();
    }
  }, [status, session, router]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events");
      if (response.ok) {
        const result = await response.json();
        setEvents(result.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
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

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.status === filter;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusStats = {
    all: events.length,
    approved: events.filter((e) => e.status === "approved").length,
    pending: events.filter((e) => e.status === "pending").length,
    rejected: events.filter((e) => e.status === "rejected").length,
  };

  const totalRegistrations = events.reduce((sum, event) => sum + event.registeredCount, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event Management</h1>
        <p className="text-gray-600">View event statistics and registrations</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{events.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {statusStats.approved} approved, {statusStats.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-gray-500 mt-1">
              Across all events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Events ({statusStats.all})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "approved"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Approved ({statusStats.approved})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "pending"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Pending ({statusStats.pending})
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "rejected"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Rejected ({statusStats.rejected})
        </button>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            No events found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <Card key={event._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          event.status
                        )}`}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-primary font-medium mb-2">
                      {event.club?.name || "Unknown Club"}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDateTime(new Date(event.date))}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          {event.registeredCount} registered
                          {event.registrationLimit && ` / ${event.registrationLimit} slots`}
                        </span>
                      </div>
                    </div>
                  </div>
                  {event.registeredCount > 0 && (
                    <button
                      onClick={() =>
                        setExpandedEvent(expandedEvent === event._id ? null : event._id)
                      }
                      className="ml-4 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {expandedEvent === event._id ? "Hide Registrations" : "View Registrations"}
                    </button>
                  )}
                </div>
              </CardHeader>

              {expandedEvent === event._id &&
                event.registeredUsers &&
                event.registeredUsers.length > 0 && (
                  <CardContent>
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-sm text-gray-700">
                        Registered Users ({event.registeredCount})
                      </h4>
                      <div className="grid gap-2">
                        {event.registeredUsers.map((user) => (
                          <div
                            key={user._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
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