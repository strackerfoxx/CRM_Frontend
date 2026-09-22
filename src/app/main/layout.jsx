import RedirectComponent from "@/components/RedirectComponent"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default async function LayoutMain({ children }) {

  return (
    <RedirectComponent>
      <SidebarProvider defaultOpen={true} >
        <AppSidebar />
        <main className="w-full bg-background">
          <div className="md:hidden flex items-center p-4 pb-0">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </RedirectComponent>
  )
}
