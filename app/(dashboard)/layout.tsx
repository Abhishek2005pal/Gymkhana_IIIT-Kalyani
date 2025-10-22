import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import React from "react";
import "../globals.css";

export const metadata = {
  title: "Dashboard - IIIT Kalyani Gymkhana",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:block">
        <DashboardSidebar />
      </aside>
      <div className="flex-1 p-6 bg-gray-50">
        {children}
      </div>
    </div>
  );
}