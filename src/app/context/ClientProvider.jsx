"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const ClientContext = createContext()

const ClientProvider = ({children}) => {
    const [clients, setClients] = useState([])
    const { token } = useUser()

    useEffect(() => {
        if(token){
            const getClients = async () => {
                const headers = {
                    "Authorization": token
                }
                try {
                    const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/client/get-clients`, { headers })
                    setClients(data.clients)
                } catch (error) {
                    console.error(error.message)
                }
            }
            
            getClients()
        }
    }, [token])
    
    const refetchClients = async () => {
        const headers = {
            "Authorization": token
        }
        try {
            const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/client/get-clients`, { headers })
            setClients(data.clients)
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <ClientContext.Provider value={{ clients, setClients, refetchClients}} >
            {children}
        </ClientContext.Provider>
    )

}

export default ClientContext
export { ClientProvider }