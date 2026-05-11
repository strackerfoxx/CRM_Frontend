"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const ClientContext = createContext()

const ClientProvider = ({children}) => {
    const [clients, setClients] = useState([
        {
            "id": "cmiwh6ofm0004vkigj3f2uo5g",
            "deletedAt": null,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "clientId": "cmiwh6occ0002vkigpzzl1uvv",
            "createdAt": "2025-12-08T01:31:14.867Z",
            "updatedAt": "2025-12-08T04:21:49.234Z",
            "client": {
                "id": "cmiwh6occ0002vkigpzzl1uvv",
                "name": "Manuel",
                "email": "",
                "phone": "5535287904",
                "token": null,
                "isConfirmed": true,
                "createdAt": "2025-12-08T01:31:14.748Z",
                "updatedAt": "2025-12-08T04:57:58.455Z"
            }
        },
        {
            "id": "cmiwnpnh2000avk6wazdrv2bk",
            "deletedAt": null,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "clientId": "cmiwnpndi0008vk6wu2vwlz8q",
            "createdAt": "2025-12-08T04:33:57.782Z",
            "updatedAt": "2025-12-08T04:47:05.370Z",
            "client": {
                "id": "cmiwnpndi0008vk6wu2vwlz8q",
                "name": "Alex Edu",
                "email": null,
                "phone": "5518839216",
                "token": null,
                "isConfirmed": true,
                "createdAt": "2025-12-08T04:33:57.654Z",
                "updatedAt": "2025-12-08T04:34:28.781Z"
            }
        },
        {
            "id": "cml5oy83u0001vktk8h2qsd3s",
            "deletedAt": null,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "clientId": "cml5owva50000vktkf8ubflmh",
            "createdAt": "2026-02-02T21:37:57.643Z",
            "updatedAt": "2026-02-02T21:37:43.426Z",
            "client": {
                "id": "cml5owva50000vktkf8ubflmh",
                "name": "Diego Castle",
                "email": "diegoyoyo2007@gmail.com",
                "phone": "5524012866",
                "token": null,
                "isConfirmed": true,
                "createdAt": "2026-02-02T21:36:54.365Z",
                "updatedAt": "2026-02-02T21:36:18.319Z"
            }
        }
    ])
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
                    console.log(error.message)
                }
            }
            
            getClients()
        }
    }, [token])
    

    return (
        <ClientContext.Provider value={{ clients }} >
            {children}
        </ClientContext.Provider>
    )

}

export default ClientContext
export { ClientProvider }