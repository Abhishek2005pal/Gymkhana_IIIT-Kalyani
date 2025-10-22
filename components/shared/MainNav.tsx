"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LogOut, Menu, User, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function MainNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  // Define navigation links based on user role
  const getNavLinks = () => {
    const links = [
      { href: "/", label: "Home" },
      { href: "/clubs", label: "Clubs" },
      { href: "/events", label: "Events" },
    ]

    // Add role-specific links
    if (session?.user) {
      if (session.user.role === "admin") {
        links.push({ href: "/admin", label: "Admin Dashboard" })
      } else if (session.user.role === "coordinator") {
        links.push({ href: "/coordinator", label: "Coordinator Dashboard" })
      }
      
      links.push({ href: `/profile`, label: "My Profile" })
    }

    return links
  }

  const navLinks = getNavLinks()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="shrink-0 flex items-center">
              <span className="font-bold text-xl text-primary">IIIT Kalyani Gymkhana</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    pathname === link.href
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {session.user.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center p-2 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
                  pathname === link.href
                    ? "bg-primary-50 border-primary text-primary"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {session?.user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="shrink-0">
                    <User className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{session.user.name}</div>
                    <div className="text-sm font-medium text-gray-500">{session.user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Button
                    variant="ghost"
                    className="block w-full text-left px-4 py-2 text-base font-medium"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsOpen(false);
                    }}
                  >
                    Sign out
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="w-full justify-start mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}