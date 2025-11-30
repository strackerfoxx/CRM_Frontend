import { useMemo } from "react"

function parseHourToMinutes(value) {
  if (!value) return NaN

  if (value.includes(":")) {
    const [h, m] = value.split(":")
    return Number(h) * 60 + Number(m)
  }

  return Number(value) * 60
}

function formatMinutes(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0")
  const m = String(mins % 60).padStart(2, "0")
  return `${h}:${m}`
}

export function useAvailableSlots({ date, servicesSelected, business, appointments }) {
  return useMemo(() => {
    if (!date || !servicesSelected?.length || !business) return []

    // Total duración de los servicios seleccionados
    const totalDuration = servicesSelected.reduce((acc, id) => {
      const service = business?.services?.find(s => s.id === id)
      return acc + (service?.durationMin || 0)
    }, 0)

    // Horarios del negocio
    const orderedDays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const todayKey = orderedDays[date.getDay()]
    const todayHours = business?.businessHours?.[todayKey] ?? {}

    const openMinutes = parseHourToMinutes(todayHours.open)
    const closeMinutes = parseHourToMinutes(todayHours.close)

    if (isNaN(openMinutes) || isNaN(closeMinutes) || closeMinutes <= openMinutes) {
      return []
    }

    // Citas existentes del día
    const isoDate = date.toISOString().split("T")[0]
    const todaysAppointments = appointments?.filter(a => a?.date?.startsWith(isoDate)) ?? []

    // Convertir citas a rangos en minutos
    const existingRanges = todaysAppointments.map(app => {
      const [h, m] = app.date.split("T")[1].substring(0, 5).split(":")
      const start = Number(h) * 60 + Number(m)
      const duration = app.services?.reduce(
        (sum, s) => sum + (s?.service?.durationMin || 0),
        0
      ) || 0
      return { start, end: start + duration }
    })

    // Crear slots cada 30 minutos
    const availableMinutes = closeMinutes - openMinutes
    const slotCount = Math.floor(availableMinutes / 30)

    const validSlots = []

    for (let i = 0; i < slotCount; i++) {
      const start = openMinutes + i * 30
      const end = start + totalDuration

      //No cabe antes del cierre
      if (end > closeMinutes) continue

      //Choca con otra cita
      const overlaps = existingRanges.some(r =>
        start < r.end && end > r.start
      )
      if (overlaps) continue

      // ✔ Válida
      validSlots.push(formatMinutes(start))
    }

    return validSlots
  }, [date, servicesSelected, business, appointments])
}
