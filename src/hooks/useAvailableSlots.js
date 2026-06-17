import api from "@/lib/api"
import { DateTime } from "luxon"

export async function useAvailableSlots({ date, servicesSelected, business, token, userId, excludeAppointmentId = undefined }) {
  if (!date || servicesSelected.length === 0 || !business || !token) return []
    const headers = {
        "Authorization": token
    }

    const services = servicesSelected.map(service => {

      if(userId){
        return {
          serviceId: service,
          userId: userId
        }
      }
      return {
        serviceId: service
      }
    })

    const data = {
      businessId: business.id,
      services,
      date: date.toISOString().split('T')[0],
      excludeAppointmentId,
      currentTime: DateTime.now().toISO()
    }

    const {data: validSlots} = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/appointment/availability/slots`, data, { headers })
    return validSlots
}
