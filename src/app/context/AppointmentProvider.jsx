"use client"
import api from "@/lib/api"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const AppointmentContext = createContext()

const AppointmentProvider = ({children}) => {
    const [appointments, setAppointments] = useState([])
    const { token } = useUser()

    useEffect(() => {
        if(token){
             const getAppointments = async () => {
                const headers = {
                    "Authorization": token
                }
                try {
                    const { data } = await api(`/appointment/get-appointments-by-params?startDate=${new Date()}&page=1&limit=20`, { headers })
                    setAppointments(data.appointments)
                } catch (error) {
                    console.error(error.message)
                }
            }
            
            getAppointments()

        }
    }, [token])
    

    return (
        <AppointmentContext.Provider value={{ appointments, setAppointments }} >
            {children}
        </AppointmentContext.Provider>
    )

}

export default AppointmentContext
export { AppointmentProvider }