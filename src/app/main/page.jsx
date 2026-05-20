"use client"
import { useAppointment } from "@/hooks/useAppointment"
import List from "@/components/List"
import Drawer from "@/components/Drawer"

import { useState } from "react"

export default function MainPage() {
  const { appointments } = useAppointment()

    const [client, setClient] = useState(undefined)
    const [date, setDate] = useState(undefined)
    const [servicesSelected, setServicesSelected] = useState([])
    const [profesional, setProfesional] = useState(undefined)
    const [hour, setHour] = useState(undefined)

  return (
    <>
      <div className="flex justify-between items-center mt-5 mx-7">
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-tight sm:mb-12 break-words overflow-hidden">Citas de hoy
          {/* <br />
          no dejar que el mismo cliente cree varias citas, si el cliente ya tiene una cita creada, mostrar un mensaje de error y no permitir crear la cita.
          
          crear endpoint para traer los profesionales disponibles para cada servicio en lugar de solo mostrar todos los asociados al servicio */}
        </h1>
        <Drawer title="Crear cita" description="Crea una cita nueva. Haz click en guardar cuando termines." label="Crear cita"
          client={client} 
          setClient={setClient} 
          date={date} 
          setDate={setDate} 
          servicesSelected={servicesSelected} 
          setServicesSelected={setServicesSelected} 
          profesional={profesional} 
          setProfesional={setProfesional} 
          hour={hour} 
          setHour={setHour}
        />
      </div>
      <List appointments={appointments} />
    </>
  )
}
