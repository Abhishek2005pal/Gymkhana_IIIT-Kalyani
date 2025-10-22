"use client"

import { cn } from "@/lib/utils"
import {
    CalendarDays,
    ChevronRight,
    DollarSign,
    LayoutDashboard,
    Settings,
    Users
} from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarLink {
  href: string
  label: string
  icon: React.ReactNode
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role

  // Define links based on role
  const getLinks = (): SidebarLink[] => {
    // Common links for coordinators and admins
    const links: SidebarLink[] = [
      {
        href: role === "admin" ? "/admin" : "/coordinator",
        label: "Dashboard",
        icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      },
      {
        href: role === "admin" ? "/admin/events" : "/coordinator/events",
        label: "Events",
        icon: <CalendarDays className="mr-2 h-4 w-4" />,
      },
    ]

    // Admin-specific links
    if (role === "admin") {
      links.push(
        {
          href: "/admin/clubs",
          label: "Clubs",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/budget",
          label: "Budget",
          icon: <DollarSign className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/users",
          label: "Users",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/settings",
          label: "Settings",
          icon: <Settings className="mr-2 h-4 w-4" />,
        }
      )
    } 
    // Coordinator-specific links
    else if (role === "coordinator") {
      links.push(
        {
          href: "/coordinator/members",
          label: "Members",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          href: "/coordinator/budget",
          label: "Budget",
          icon: <DollarSign className="mr-2 h-4 w-4" />,
        },
        {
          href: "/coordinator/settings",
          label: "Settings",
          icon: <Settings className="mr-2 h-4 w-4" />,
        }
      )
    }

    return links
  }

  const links = getLinks()

  return (
    <div className="flex flex-col w-64 h-full bg-white shadow-sm">
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold">{role === "admin" ? "Admin Dashboard" : "Coordinator Dashboard"}</h2>
      </div>
      <nav className="flex-1 pt-2">
        <div className="space-y-1 px-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-md group",
                pathname === link.href
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {link.icon}
              <span className="flex-1">{link.label}</span>
              <ChevronRight className={cn(
                "h-4 w-4 opacity-0 transition-opacity",
                pathname === link.href ? "opacity-100" : "group-hover:opacity-100"
              )} />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}