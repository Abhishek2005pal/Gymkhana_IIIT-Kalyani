"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatDateTime } from "@/lib/utils";
import { Calendar, Mail, MapPin, User, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ClubDetail({ params }: Props) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [club, setClub] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      const response = await fetch(`/api/clubs/${id}`);
      if (!response.ok) throw new Error("Failed to fetch club");
      const data = await response.json();
      setClub(data.club);

      // Fetch club events
      const eventsResponse = await fetch(`/api/events?club=${id}`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.data || []);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load club details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please login to join clubs",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setJoining(true);
    try {
      const response = await fetch(`/api/clubs/${id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to join club");
      }

      toast({
        title: "Success",
        description: "You have successfully joined the club!",
      });
      
      fetchClubDetails(); // Refresh club data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Club not found</div>
      </div>
    );
  }

  const isMember = session?.user && club.members?.some((m: any) => m._id === session.user?.id);

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Club Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start space-x-6">
              <div className="h-24 w-24 bg-linear-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center shrink-0">
                {club.logoUrl ? (
                  <img 
                    src={club.logoUrl} 
                    alt={club.name} 
                    className="h-24 w-24 rounded-lg object-cover" 
                  />
                ) : (
                  <span className="text-4xl font-bold text-primary">
                    {club.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-3xl mb-2">{club.name}</CardTitle>
                <CardDescription className="text-base mb-4">
                  {club.description}
                </CardDescription>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>Coordinator: {club.coordinator?.name || "TBD"}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{club.members?.length || 0} members</span>
                  </div>
                  {club.coordinator?.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{club.coordinator.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="shrink-0">
              {isMember ? (
                <Button disabled className="w-full md:w-auto">
                  Already a Member
                </Button>
              ) : (
                <Button 
                  onClick={handleJoinClub} 
                  disabled={joining}
                  className="w-full md:w-auto"
                >
                  {joining ? "Joining..." : "Join Club"}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No upcoming events scheduled yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((event: any) => {
              const eventDate = new Date(event.date);
              const registeredCount = event.registeredUsers?.length || 0;

              return (
                <Card key={event._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDateTime(eventDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{registeredCount} registered</span>
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <Link href={`/events/${event._id}`}>View Event</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}