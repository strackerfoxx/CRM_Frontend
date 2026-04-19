"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const ServiceContext = createContext()

const ServiceProvider = ({children}) => {
    const [services, setServices] = useState([])
    const { token } = useUser()

    useEffect(() => {
        if(token){
             const getServices = async () => {
                const headers = {
                    "Authorization": token
                }
                try {
                    const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/service/get-services`, { headers })
                    setServices(data.services)
                    console.log(data)
                } catch (error) {
                    console.log(error.message)
                }
            }
            
            getServices()
        }
    }, [token])
    

    return (
        <ServiceContext.Provider value={{ services }} >
            {children}
        </ServiceContext.Provider>
    )

}

export default ServiceContext
export { ServiceProvider }