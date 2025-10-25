"use client"
import { DrawerDialog } from "@/components/ui/DrawerDialog"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DateTimePicker } from "@/components/DateTimePicker"

import { useBusiness } from "@/hooks/useBusiness"

export default function Drawer() {
    const { business } = useBusiness()
    console.log(business)
  return (
    <div>
        <DrawerDialog title="Crear Cita" description="Crea una cita nieva. Haz click en guardar cuando termines.">
            <form className={cn("grid items-start gap-6")}>
                <div className="grid gap-3">
                    <Label htmlFor="Cliente">Cliente</Label>

                    <Select name="cliente" id="cliente">
                        <SelectTrigger  className="w-full">
                            <SelectValue placeholder="Choose department" />
                        </SelectTrigger>
                        <SelectContent>
                            {business?.clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>{client?.client?.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* <Input type="hidden" id="businessId" value={useBusiness().id} /> */}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="username">Fecha</Label>
                    {/* <Input id="username" defaultValue="@shadcn" /> */}
                    <DateTimePicker />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="username">Fecha</Label>
                    {/* <Input id="username" defaultValue="@shadcn" /> */}
                </div>


                <Button type="submit">Save changes</Button>
            </form>
        </DrawerDialog>
    </div>
  )
}
