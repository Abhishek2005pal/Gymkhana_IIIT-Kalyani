import Link from "next/link";

export default async function AdminClubsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clubs</h1>
        <Link href="/admin/clubs/create" className="text-sm text-primary underline">Create Club</Link>
      </div>

      <div className="grid gap-4">
        <div className="bg-white p-4 rounded shadow">Club listing placeholder</div>
      </div>
    </div>
  );
}