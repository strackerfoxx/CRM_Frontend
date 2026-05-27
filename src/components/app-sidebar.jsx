"use client"

import { Calendar, Users, ClipboardClock, Handshake, ChevronUp, LayoutDashboard, FileBox, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/useLogout"

// Menu items.
const items = [
  {
    title: "Panel",
    url: "/main/",
    icon: LayoutDashboard,
  },
  {
    title: "Calendario",
    url: "/main/calendar",
    icon: Calendar,
  },
  {
    title: "Clientes",
    url: "/main/clients",
    icon: Handshake,
  },
  {
    title: "Citas",
    url: "/main/appointments",
    icon: ClipboardClock,
  },
  {
    title: "Servicios",
    url: "/main/services",
    icon: FileBox,
  },
  {
    title: "Equipo",
    url: "/main/profesionals",
    icon: Users,
  },
  {
    title: "Configuración",
    url: "/main/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const logout = useLogout()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
        <div className="relative flex items-center justify-between px-2 text-center text-xl font-bold">
          <SidebarGroupLabel>Aera</SidebarGroupLabel>

          <SidebarTrigger
            className="absolute top-2 right-1 size-6 transition-opacity group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:visible"
          />
        </div>
          <SidebarGroupContent className="transition-all group-data-[collapsible=icon]:mt-13 mt-5 transition-none">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className=" rounded-r-lg hover:bg-neutral-900">
                  <SidebarMenuButton asChild className="[&>svg]:size-5" isActive={true}>
                    <Link href={item.url} className="flex items-center h-6 px-4 my-3">
                      <item.icon/>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    Username ⌘
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-56" align="start bg-gray-400"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button onClick={handleLogout} variant="outline" className="w-full">
                      Sign out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}