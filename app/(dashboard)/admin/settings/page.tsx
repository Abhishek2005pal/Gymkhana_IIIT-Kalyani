"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
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

    if (status === "authenticated" && session?.user?.role !== "admin") {
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

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage system settings and configurations</p>
      </div>

      <div className="grid gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">System Name</label>
              <Input
                type="text"
                defaultValue="IIIT Kalyani Gymkhana Management System"
                placeholder="System name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Admin Email</label>
              <Input
                type="email"
                defaultValue={session.user.email}
                placeholder="Admin email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Phone</label>
              <Input type="tel" placeholder="+91 1234567890" />
            </div>
          </CardContent>
        </Card>

        {/* Event Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Event Management Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Default Registration Limit
              </label>
              <Input type="number" defaultValue="100" placeholder="100" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="autoApprove" className="h-4 w-4" />
              <label htmlFor="autoApprove" className="text-sm">
                Auto-approve events from verified coordinators
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Budget Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Default Club Budget Allocation (₹)
              </label>
              <Input type="number" defaultValue="50000" placeholder="50000" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="requireApproval" className="h-4 w-4" defaultChecked />
              <label htmlFor="requireApproval" className="text-sm">
                Require admin approval for expense submissions
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
