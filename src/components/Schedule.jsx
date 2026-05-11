"use client"
import { useState, useEffect } from "react"
import { useBusiness } from "@/hooks/useBusiness"
import { useAvailableSlots } from "@/hooks/useAvailableSlots"
import Spinner from "./Spinner"

import { useUser } from "@/hooks/useUser"

export default function Schedule({ date, servicesSelected, hour, setHour, userId, appointmentId = null }) {
  const { business } = useBusiness()
  const [slots, setSlots] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { token } = useUser()
  
  if (!date || servicesSelected.length === 0) {
    return <h1>Tienes que seleccionar una fecha y servicios</h1>
  }

  useEffect(() => {
    if(!token) return
    setIsLoading(true)
    async function fetchSlots() {
      setSlots(await useAvailableSlots({ date, servicesSelected, business, token, userId, excludeAppointmentId: appointmentId }))
    }
    fetchSlots()
    
    setIsLoading(false)
  }, [servicesSelected, date, userId, token])
  

  if (slots.length === 0) {
    return <h1>No hay horarios disponibles</h1>
  }


  return (
    <div>
      {isLoading ? <Spinner /> : (
        slots.map(time => (
          <button
            key={time}
            onClick={() => setHour(time)}
            type="button"
            className={`m-2 p-2 border rounded font-bold cursor-pointer
              ${hour === time ? "bg-blue-600 text-white" : "hover:bg-neutral-800"}`}
          >
            {time}
          </button>
        ))
      )}
    </div>
  )
}
