"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { useDrawer } from "@/hooks/useDrawer"

export function DrawerDialog({children, title, description}) {
  const { open, setOpen } = useDrawer()
  const isDesktop = window.innerWidth >= 768

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 p-2 rounded-3xl font-semibold px-4 text-white hover:bg-blue-700 cursor-pointer" >{title}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] bg-card max-h-[90dvh] flex flex-col overflow-hidden">
          <DialogHeader className="shrink-0 px-4 pt-4 sm:px-6">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 sm:px-6">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-card flex flex-col overflow-hidden">
        <DrawerHeader className="shrink-0 px-4 pb-3 pt-4 text-left sm:px-6">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DrawerHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 sm:px-6">
          {children}
        </div>
        {/* <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  )
}

