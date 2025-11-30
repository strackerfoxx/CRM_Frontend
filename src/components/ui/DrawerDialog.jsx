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

export function DrawerDialog({children}) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = window.innerWidth >= 768

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Crear Cita</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] bg-neutral-900 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Cita</DialogTitle>
            <DialogDescription>
              Crea una cita nueva. Haz click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DrawerTrigger>
      <DrawerContent className="bg-neutral-900">
        <DrawerHeader className="text-left">
          <DialogTitle>Crear Cita</DialogTitle>
            <DialogDescription>
              Crea una cita nueva. Haz click en guardar cuando termines.
            </DialogDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

