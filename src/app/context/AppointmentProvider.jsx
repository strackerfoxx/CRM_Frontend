"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const AppointmentContext = createContext()

const AppointmentProvider = ({children}) => {
    const [appointments, setAppointments] = useState([])
    const { token } = useUser()

    const getAppointments = async () => {
        const headers = {
            "Authorization": token
        }
        try {
            const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-params?startDate=${new Date()}&page=1&limit=20`, { headers })
            setAppointments(data.appointments)
            console.log("Appointments fetched:", data.appointments)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if(token) {getAppointments()}
    }, [token])
    

    return (
        <AppointmentContext.Provider value={{ appointments, setAppointments, getAppointments }} >
            {children}
        </AppointmentContext.Provider>
    )

}

export default AppointmentContext
export { AppointmentProvider }