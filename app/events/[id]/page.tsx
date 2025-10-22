"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatDateTime } from "@/lib/utils";
import { Calendar, CheckCircle, MapPin, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EventDetail({ params }: Props) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) throw new Error("Failed to fetch event");
      const data = await response.json();
      setEvent(data.event);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please login to register for events",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setRegistering(true);
    try {
      const response = await fetch(`/api/events/${id}/register`, {
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
        throw new Error(error.error || "Failed to register");
      }

      toast({
        title: "Success",
        description: "You have successfully registered for this event!",
      });
      
      fetchEventDetails(); // Refresh event data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">Event not found</div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const registeredCount = event.registeredUsers?.length || 0;
  const hasLimit = event.registrationLimit;
  const isFull = hasLimit && registeredCount >= event.registrationLimit;
  const isRegistered = session?.user && event.registeredUsers?.some(
    (u: any) => u._id === session.user?.id || u === session.user?.id
  );
  const isPastEvent = eventDate < new Date();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/events">← Back to Events</Link>
        </Button>

        {/* Event Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                <CardDescription className="text-base">
                  <Link 
                    href={`/clubs/${event.club?._id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {event.club?.name || "Unknown Club"}
                  </Link>
                </CardDescription>
              </div>
              <div className="shrink-0">
                {isPastEvent ? (
                  <Button disabled className="w-full md:w-auto">
                    Event Ended
                  </Button>
                ) : isRegistered ? (
                  <Button disabled className="w-full md:w-auto">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registered
                  </Button>
                ) : isFull ? (
                  <Button disabled className="w-full md:w-auto">
                    Registration Full
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRegister} 
                    disabled={registering}
                    className="w-full md:w-auto"
                  >
                    {registering ? "Registering..." : "Register Now"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Event Info */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-gray-600">{formatDateTime(eventDate)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="font-medium">Registration</p>
                    <p className="text-sm text-gray-600">
                      {registeredCount} registered
                      {hasLimit && ` / ${event.registrationLimit} spots`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-start justify-end">
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  event.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : event.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">About this Event</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Registration Notice */}
        {!session && !isPastEvent && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-4">
              <p className="text-sm text-blue-900">
                <Link href="/login" className="font-medium underline">Login</Link>
                {" "}or{" "}
                <Link href="/register" className="font-medium underline">Register</Link>
                {" "}to register for this event
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
