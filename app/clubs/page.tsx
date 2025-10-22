import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/dbConnect";
import ClubModel from "@/models/club.model";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function ClubsPage() {
  await dbConnect();
  const clubs = await ClubModel.find()
    .populate("coordinator", "name email")
    .select("name description logoUrl coordinator members")
    .lean();

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Clubs Directory</h1>
        <p className="text-gray-600">Explore and join student clubs at IIIT Kalyani</p>
      </div>

      {clubs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No clubs available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club: any) => (
            <Card key={club._id.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-linear-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center shrink-0">
                    {club.logoUrl ? (
                      <img 
                        src={club.logoUrl} 
                        alt={club.name} 
                        className="h-16 w-16 rounded-lg object-cover" 
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {club.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl mb-1">{club.name}</CardTitle>
                    <CardDescription className="flex items-center text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {club.members?.length || 0} members
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {club.description}
                </p>
                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/clubs/${club._id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}