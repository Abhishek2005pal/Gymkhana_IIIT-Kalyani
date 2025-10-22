import Link from "next/link";

export default async function AdminEventsPage() {
  // Server component placeholder: ideally fetch all events and pending list via API
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Events Management</h1>
        <Link href="/admin/events/create" className="text-sm text-primary underline">Create Event</Link>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Use the pending events view to approve or reject events.</p>
        <div className="bg-white rounded-md shadow p-4">
          <p className="text-sm text-gray-600">No events to display (placeholder)</p>
        </div>
      </div>
    </div>
  );
}