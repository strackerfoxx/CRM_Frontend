"use client"
import api from "@/lib/api"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const TeamContext = createContext()

const TeamProvider = ({children}) => {
    const [team, setTeam] = useState([])
    const { token } = useUser()

    useEffect(() => {
        if(token){
             const getTeam = async () => {
                const headers = {
                    "Authorization": token
                }
                try {
                    const { data } = await api(`/user/get-all-users`, { headers })
                    setTeam(data)
                    
                } catch (error) {
                    console.error(error.message)
                }
            }
            
            getTeam()
        }
    }, [token])

    return (
        <TeamContext.Provider value={{ team }} >
            {children}
        </TeamContext.Provider>
    )

}

export default TeamContext
export { TeamProvider }