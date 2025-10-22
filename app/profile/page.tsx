"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Calendar, Mail, MapPin, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user) {
      fetchUserData();
    }
  }, [status, session]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const userResponse = await fetch(`/api/users/${session?.user?.id}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserData(userData.user);
      }

      // Fetch registered events
      const eventsResponse = await fetch(`/api/events?userId=${session?.user?.id}`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p>Please login to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start space-x-4">
              <div className="h-20 w-20 bg-linear-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center shrink-0">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {userData?.name || session.user.name}
                </CardTitle>
                <div className="text-base text-muted-foreground space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{userData?.email || session.user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Role:</span>
                    <span className="capitalize">{userData?.role || session.user.role}</span>
                  </div>
                  {userData?.studentId && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Student ID:</span>
                      <span>{userData.studentId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Registered Events */}
        <div>
          <h2 className="text-2xl font-bold mb-4">My Registered Events</h2>
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                <p>You haven't registered for any events yet.</p>
                <Link href="/events" className="text-primary hover:underline mt-2 inline-block">
                  Browse Events
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event: any) => {
                const eventDate = new Date(event.date);
                const isPastEvent = eventDate < new Date();

                return (
                  <Card key={event._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <CardDescription className="font-medium text-primary">
                        {event.club?.name || "Unknown Club"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 shrink-0" />
                          <span>{formatDateTime(eventDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        {isPastEvent && (
                          <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block">
                            Event Completed
                          </div>
                        )}
                      </div>
                      <Link 
                        href={`/events/${event._id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details →
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}