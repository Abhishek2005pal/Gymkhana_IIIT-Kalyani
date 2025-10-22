import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/dbConnect";
import { formatDateTime } from "@/lib/utils";
import ClubModel from "@/models/club.model";
import EventModel from "@/models/event.model";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
  await dbConnect();
  
  // Ensure Club model is registered
  ClubModel;
  
  const now = new Date();
  const events = await EventModel.find({ status: "approved", date: { $gte: now } })
    .populate("club", "name")
    .sort({ date: 1 })
    .lean();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
        <p className="text-gray-600">Discover and register for exciting campus events</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No upcoming events.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => {
            const eventDate = new Date(event.date);
            const registeredCount = event.registeredUsers?.length || 0;
            const hasLimit = event.registrationLimit;
            const isFull = hasLimit && registeredCount >= event.registrationLimit;

            return (
              <Card key={event._id.toString()} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {event.club?.name || "Unknown Club"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                      <span>{formatDateTime(eventDate)}</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 shrink-0" />
                      <span>
                        {registeredCount} registered
                        {hasLimit && ` / ${event.registrationLimit} slots`}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href={`/events/${event._id}`}>View Details</Link>
                    </Button>
                    {isFull ? (
                      <Button disabled className="flex-1">Full</Button>
                    ) : (
                      <Button asChild className="flex-1">
                        <Link href={`/events/${event._id}`}>Register</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}