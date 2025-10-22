import { Card as _Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminHome() {
  // This can be enhanced to fetch analytics from server APIs
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <_Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">—</p>
          </CardContent>
        </_Card>

        <_Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">—</p>
          </CardContent>
        </_Card>

        <_Card>
          <CardHeader>
            <CardTitle>Overall Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">—</p>
          </CardContent>
        </_Card>
      </div>
    </div>
  );
}