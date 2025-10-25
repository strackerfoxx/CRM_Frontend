"use client"
import { useAppointment } from "@/hooks/useAppointment"
import List from "@/components/List"

export default function MainPage() {
  const { appointments } = useAppointment()

  return (
    <>
      <div className="flex justify-between items-center mt-5 mx-7">
        <h1 className="scroll-m-20 text-start text-3xl font-bold tracking-tight text-balance " >Citas de hoy</h1>
        <button className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear Cita</button>
      </div>
      <List appointments={appointments} />
    </>
  )
}
