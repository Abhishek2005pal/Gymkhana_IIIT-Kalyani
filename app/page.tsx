import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          IIIT Kalyani Gymkhana Management System
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-600">
          Your centralized platform for all student-run clubs and activities at IIIT Kalyani.
          Browse clubs, register for events, and stay connected with campus activities.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/clubs">Explore Clubs</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/events">View Events</Link>
          </Button>
        </div>
      </div>

      <div className="mt-24 grid gap-12 md:grid-cols-3">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Join Clubs</h2>
          <p className="text-gray-600">
            Find and join student clubs that match your interests. Connect with like-minded people and build your community.
          </p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Attend Events</h2>
          <p className="text-gray-600">
            Discover upcoming events, register with a single click, and expand your horizons with diverse activities.
          </p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Track Activities</h2>
          <p className="text-gray-600">
            Keep track of your registered events, club memberships, and participation through your personal profile.
          </p>
        </div>
      </div>
    </div>
  );
}