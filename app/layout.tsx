import AuthProvider from "@/components/providers/AuthProvider";
import { MainNav } from "@/components/shared/MainNav";
import { Toaster } from "@/components/shared/Toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IIIT Kalyani Gymkhana",
  description: "Gymkhana Management System for IIIT Kalyani",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <MainNav />
            <main className="grow">{children}</main>
            <footer className="border-t py-6 bg-gray-50">
              <div className="container mx-auto text-center text-sm text-gray-600">
                © {new Date().getFullYear()} IIIT Kalyani Gymkhana Management System
              </div>
            </footer>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}