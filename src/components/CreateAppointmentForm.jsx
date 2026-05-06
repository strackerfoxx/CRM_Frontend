"use client"
import axios from "axios"
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

import { toast } from "sonner"

import { DateTimePicker } from "@/components/DateTimePicker"
import Schedule from "@/components/Schedule"

import { useBusiness } from "@/hooks/useBusiness"
import { useClient } from "@/hooks/useClients"
import { useUser } from "@/hooks/useUser"
import { useService } from "@/hooks/useService"
import { useDrawer } from "@/hooks/useDrawer"
import { useAppointment } from "@/hooks/useAppointment"

import { useState } from "react"
import { set } from "zod"

export default function createAppointmentForm({
    label,
    client,
    setClient,
    date,
    setDate,
    servicesSelected,
    setServicesSelected,
    profesional,
    setProfesional,
    hour,
    setHour
}) {

    const { business } = useBusiness()
    const { clients } = useClient()
    const { services } = useService()
    const { setAppointments } = useAppointment()
    const { closeDrawer } = useDrawer()
    const { token, user } = useUser()

    const [loading, setLoading] = useState(false)


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

        const servicesQuery = []
        for (const id of servicesSelected) {
            servicesQuery.push({serviceId: id, userId: profesional})
        }

        const appointmentData = {
            date: new Date(date).toJSON().split("T")[0],
            businessClientId: client,
            services: servicesQuery,
            businessId: business.id,
            user: user.id,
            startTime: hour
        }
        const createAppointment = async () => {
                const headers = {
                    "Authorization": token  
                } 

                try {
                    setLoading(true)
                    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/appointment/create`, appointmentData, { headers })
                    toast.success(data?.msg || "Cita creada exitosamente")
                    setAppointments(prev => [...prev, data.appointment])
                } catch (error) {
                    console.log(error)
                    console.log(data?.msg)
                    toast.error(data?.msg || "Error al crear la cita")
                }finally {
                    setTimeout(() => {
                        closeDrawer()
                        setLoading(false)
                        setClient(undefined)
                        setDate(undefined)
                        setProfesional(undefined)
                        setHour(undefined)
                        setServicesSelected([])
                    }, 1000);
                }
            }
            createAppointment()
        }
                

  return (
    <form className={cn("grid items-start gap-6")} onSubmit={ event => handlesubmit(event)}>

        <div className="grid gap-3">
            <Label htmlFor="cliente">Cliente</Label>

            <Select name="cliente" id="cliente" onValueChange={(value) => setClient(value)}>
                <SelectTrigger  className="w-full">
                    <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                    {clients?.map((client) => (
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
            <Label htmlFor="servicio">Servicios</Label>
            {/* <Input id="username" defaultValue="@shadcn" /> */}
            {/* <DateTimePicker date={date} setDate={setDate}  /> */}
            <ServiceCard services={services} servicesSelected={servicesSelected} setServicesSelected={setServicesSelected} />
        </div>
        {!date || servicesSelected.length === 0 ? null : (
            <>

            {/* lO QUE TENEMOS QUE HACER ES PRIMERO SOLO MOSTRAR LOS PROFESIONALES QUE PUEDEN HACER LOS SERVICIOS SELECCIONADOS */}
            

            <div className="grid gap-3">
                <Label htmlFor="profesional">Profesional</Label>

                <Select name="profesional" id="profesional" onValueChange={(value) => setProfesional(value)}>
                    <SelectTrigger  className="w-full">
                        <SelectValue placeholder="Seleccionar profesional" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* <SelectItem key="automatic" value="automatic">Seleccionar Automaticamente</SelectItem> */}
                        {business?.users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>{user?.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {!date || servicesSelected.length === 0 ? <></> :
                <div className="grid gap-3">
                    <Label htmlFor="hora">Horarios disponibles:</Label>
                    
                    <Schedule date={date} servicesSelected={servicesSelected} setHour={setHour} hour={hour} userId={profesional} />
                </div>
            }

            {/* {!date || servicesSelected.length === 0 || !hour ? <Button type="submit" disabled >Guardar cambios</Button> : <Button type="submit" >Guardar cambios</Button>} */}
            <Button className="cursor-pointer" type="submit" disabled={loading} >
                {label}
            </Button>
            </>
        )}
    </form>
  )
}