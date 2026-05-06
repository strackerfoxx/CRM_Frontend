"use client"

import { createContext, useMemo, useState } from "react"

const DrawerContext = createContext()

export function DrawerProvider({ children }) {
  const [open, setOpen] = useState(false)

  const value = useMemo(
    () => ({
      open,
      setOpen,
      closeDrawer: () => setOpen(false),
      openDrawer: () => setOpen(true),
      toggleDrawer: () => setOpen((prev) => !prev),
    }),
    [open]
  )

  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  )
}

export { DrawerContext }
