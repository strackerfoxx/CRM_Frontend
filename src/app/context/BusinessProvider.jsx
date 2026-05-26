"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const BusinessContext = createContext()

const BusinessProvider = ({ children }) => {
    const [business, setBusiness] = useState({})
    const { token } = useUser()

    useEffect(() => {
        if(token){
             const getBusiness = async () => {
                const headers = {
                    "Authorization": token
                }
                try {
                    const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/business/get-business-by-id`, { headers })
                    setBusiness(data)
                } catch (error) {
                    console.error(error.message)
                }
            }
            getBusiness()

        }
    }, [token])

    return (
        <BusinessContext.Provider value={{ business, setBusiness }}>
            {children}
        </BusinessContext.Provider>
    )
}

export default BusinessContext
export { BusinessProvider }