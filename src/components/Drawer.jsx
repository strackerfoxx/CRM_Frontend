"use client"
import { DrawerDialog } from "@/components/ui/DrawerDialog"
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import ServiceCard from "@/components/ServiceCard"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DateTimePicker } from "@/components/DateTimePicker"
import Schedule from "@/components/Schedule"

import { useBusiness } from "@/hooks/useBusiness"
import { useState } from "react"

export default function Drawer() {
    const { business } = useBusiness()
    const [date, setDate] = useState(undefined)
    const [hour, setHour] = useState(undefined)
    const [client, setClient] = useState(undefined)
    const [profesional, setProfesional] = useState(undefined)
    const [servicesSelected, setServicesSelected] = useState([])

    async function handlesubmit(e){
        e.preventDefault();

        // Esto funciona teoricamente bien pero el problema bien cuando imaginando que se agendó una cita a las 12
        // y los servicios en total duran 3 horas no hay forma de bloquear el tiempo que se vaya a tardar el personal
        // una solucion superficial es que el selector de minutos vaya de 20 en 20/30 o asi pero eso no resuelve
        // realmente el problema, la solucion real es asignar obligatoriamente un empleado a cada cita, que cada empleado
        // tenga su propio horario y que se bloquee el tiempo que se va a tardar en terminar una cita,
        // esto conllevaria un desafio tecnico aunque por otro lado ofrece mas valor agregado ya que aparte de ser un sistema
        // gestor de citas tambien empezaria a entrar en un sistema de gestion de personal

        // console.log(client)
        // console.log(new Date(date).toJSON().split("T")[0] + "T" + hourPicked + ":00")
        // console.log(servicesSelected)

        // aqui el problema es que si por ejemplo van una hora a comer o en general hay una hora (entre el horario establecido)
        // en el que no estan disponibles no quitamos esa hora, solo se recibe hora de apertura y cierre
        
        console.log({
            "date": new Date(date).toJSON().split("T")[0] + "T" + hour + ":00", 
            "clientId": client, 
            "services": servicesSelected, 
            "businessId": business.id,
            "user": profesional
        })
    }
  return (
    <div>
        <DrawerDialog title="Crear Cita" description="Crea una cita nueva. Haz click en guardar cuando termines.">
            <form className={cn("grid items-start gap-6")} onSubmit={ event => handlesubmit(event)}>
                <div className="grid gap-3">
                    <Label htmlFor="cliente">Cliente</Label>

                    <Select name="cliente" id="cliente" onValueChange={(value) => setClient(value)}>
                        <SelectTrigger  className="w-full">
                            <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            {business?.clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>{client?.client?.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="fecha">Fecha</Label>
                    {/* <Input id="username" defaultValue="@shadcn" /> */}
                    <DateTimePicker date={date} setDate={setDate}  />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="profesional">Profesional</Label>

                    <Select name="cliente" id="cliente" onValueChange={(value) => setProfesional(value)}>
                        <SelectTrigger  className="w-full">
                            <SelectValue placeholder="Seleccionar profesional" />
                        </SelectTrigger>
                        <SelectContent>
                            {business?.users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>{user?.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="servicio">Servicios</Label>
                    {/* <Input id="username" defaultValue="@shadcn" /> */}
                    {/* <DateTimePicker date={date} setDate={setDate}  /> */}
                    <ServiceCard services={business.services} servicesSelected={servicesSelected} setServicesSelected={setServicesSelected} />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="hora">Horarios disponibles:</Label>
                    
                    {/* <TimeWheel date={date} hourPicked={hourPicked} /> */}
                    <Schedule date={date} servicesSelected={servicesSelected} setHour={setHour} hour={hour}/>
                </div>


            <Button type="submit">Guardar cambios</Button>
            </form>
        </DrawerDialog>
    </div>
  )
}
