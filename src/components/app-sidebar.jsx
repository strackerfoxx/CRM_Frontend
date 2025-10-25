import { Calendar, Users, ClipboardClock, Handshake, ChevronUp, LayoutDashboard, FileBox } from "lucide-react"
import Link from "next/link"

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
    url: "/main/users",
    icon: Users,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
        <div className="relative flex items-center justify-between px-2 text-center text-xl font-bold">
          <SidebarGroupLabel>Foxx CRM</SidebarGroupLabel>

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
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}