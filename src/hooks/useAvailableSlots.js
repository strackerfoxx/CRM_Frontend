import axios from "axios"


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
      excludeAppointmentId
    }

    const {data: validSlots} = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/appointment/availability/slots`, data, { headers })
    return validSlots
}
