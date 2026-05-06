import { useContext } from "react"
import { DrawerContext } from "@/app/context/DrawerProvider"

export function useDrawer() {
  const context = useContext(DrawerContext)

  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider")
  }

  return context
}
