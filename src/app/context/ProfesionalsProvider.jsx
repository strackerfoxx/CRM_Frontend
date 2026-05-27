"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const ProfesionalContext = createContext()

const ProfesionalProvider = ({children}) => {
    const [professionals, setProfessionals] = useState([])
    const { token } = useUser()

    useEffect(() => {
        if(token){
            const getProfesionals = async () => {
                const headers = {
                    "Authorization": token
                }
                try {
                    const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/user/get-all-users`, { headers })
                    setProfessionals(data)
                } catch (error) {
                    console.error(error.message)
                }
            }
            
            getProfesionals()
        }
    }, [token])
    

    return (
        <ProfesionalContext.Provider value={{ professionals }} >
            {children}
        </ProfesionalContext.Provider>
    )

}

export default ProfesionalContext
export { ProfesionalProvider }