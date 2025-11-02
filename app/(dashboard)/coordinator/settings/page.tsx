"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CoordinatorSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== "coordinator") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, session, router]);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
      setSaving(false);
    }, 1000);
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your coordinator profile and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                type="text"
                defaultValue={session.user.name}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                defaultValue={session.user.email}
                placeholder="Your email"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input type="tel" placeholder="+91 1234567890" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="emailNotif" className="h-4 w-4" defaultChecked />
              <label htmlFor="emailNotif" className="text-sm">
                Receive email notifications for new event registrations
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="budgetNotif" className="h-4 w-4" defaultChecked />
              <label htmlFor="budgetNotif" className="text-sm">
                Notify me when budget allocation is updated
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="memberNotif" className="h-4 w-4" />
              <label htmlFor="memberNotif" className="text-sm">
                Notify me when new members join the club
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Club Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Club Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="autoAccept" className="h-4 w-4" />
              <label htmlFor="autoAccept" className="text-sm">
                Auto-accept club membership requests
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="publicEvents" className="h-4 w-4" defaultChecked />
              <label htmlFor="publicEvents" className="text-sm">
                Make events public by default
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
