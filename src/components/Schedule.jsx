"use client"
import { useBusiness } from "@/hooks/useBusiness"
import { useAppointment } from "@/hooks/useAppointment"
import { useAvailableSlots } from "@/hooks/useAvailableSlots"

export default function Schedule({ date, servicesSelected, hour, setHour }) {
  const { business } = useBusiness()
  const { appointments } = useAppointment()

  const slots = useAvailableSlots({
    date,
    servicesSelected,
    business,
    appointments
  })

  if (!date || !servicesSelected?.length) {
    return <h1>Tienes que seleccionar una fecha y servicios</h1>
  }

  if (slots.length === 0) {
    return <h1>No hay horarios disponibles</h1>
  }

  return (
    <div>
      {slots.map(time => (
        <button
          key={time}
          onClick={() => setHour(time)}
          type="button"
          className={`m-2 p-2 border rounded font-bold cursor-pointer
            ${hour === time ? "bg-blue-600 text-white" : "hover:bg-neutral-800"}`}
        >
          {time}
        </button>
      ))}
    </div>
  )
}
