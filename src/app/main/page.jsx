"use client"
import { useAppointment } from "@/hooks/useAppointment"
import List from "@/components/List"
import Drawer from "@/components/Drawer"

export default function MainPage() {
  const { appointments } = useAppointment()

  return (
    <>
      <div className="flex justify-between items-center mt-5 mx-7">
        <h1 className="scroll-m-20 text-start text-3xl font-bold tracking-tight text-balance " >Citas de hoy</h1>
        <Drawer title="Crear cita" description="Crea una cita nueva. Haz click en guardar cuando termines." label="Crear cita" />
      </div>
      <List appointments={appointments} />
    </>
  )
}
