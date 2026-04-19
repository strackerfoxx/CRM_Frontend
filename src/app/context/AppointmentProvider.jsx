"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const AppointmentContext = createContext()

const AppointmentProvider = ({children}) => {
    const [appointments, setAppointments] = useState([
    {
        "id": "cmjxu2xtm0001vk8o1fjpz4f6",
        "date": "2026-01-10T06:00:00.000Z",
        "startTime": "12:00",
        "endTime": "13:20",
        "durationMin": 80,
        "startTimeMinutes": 720,
        "endTimeMinutes": 800,
        "status": "SCHEDULED",
        "businessId": "cmiwg5e9w0000vkbg03hsebwf",
        "userId": null,
        "businessClientId": "cmiwh6ofm0004vkigj3f2uo5g",
        "createdAt": "2026-01-03T04:59:43.879Z",
        "updatedAt": "2026-01-03T04:59:43.879Z",
        "services": [
            {
                "id": "cmjxu2xx40002vk8odv7s52an",
                "appointmentId": "cmjxu2xtm0001vk8o1fjpz4f6",
                "serviceId": "cmj9nvo1d0001vknktf60petq",
                "userId": "cmj9np1le0001vkg8tbxui9zc",
                "createdAt": "2026-01-03T04:59:44.057Z",
                "updatedAt": "2026-01-03T04:59:44.057Z",
                "service": {
                    "id": "cmj9nvo1d0001vknktf60petq",
                    "name": "Extensiones de Pestañas",
                    "durationMin": 80,
                    "cleaningTimeMin": 0,
                    "price": 999.99,
                    "description": null,
                    "imageUrl": null,
                    "category": null,
                    "isActive": true,
                    "businessId": "cmiwg5e9w0000vkbg03hsebwf",
                    "createdAt": "2025-12-17T06:59:38.737Z",
                    "updatedAt": "2025-12-29T01:04:51.064Z"
                }
            }
        ],
        "businessClient": {
            "id": "cmiwh6ofm0004vkigj3f2uo5g",
            "client": {
                "name": "Manuel",
                "email": "",
                "phone": "5535287904"
            }
        },
        "user": null
    },
    {
        "id": "cmjxu4lpg0004vk8ohe66sjgl",
        "date": "2026-01-10T06:00:00.000Z",
        "startTime": "12:20",
        "endTime": "13:40",
        "durationMin": 80,
        "startTimeMinutes": 740,
        "endTimeMinutes": 820,
        "status": "SCHEDULED",
        "businessId": "cmiwg5e9w0000vkbg03hsebwf",
        "userId": null,
        "businessClientId": "cmiwnpnh2000avk6wazdrv2bk",
        "createdAt": "2026-01-03T05:01:01.541Z",
        "updatedAt": "2026-01-03T05:01:01.541Z",
        "services": [
            {
                "id": "cmjxu4lqz0005vk8oeuq8ena2",
                "appointmentId": "cmjxu4lpg0004vk8ohe66sjgl",
                "serviceId": "cmj9nvo1d0001vknktf60petq",
                "userId": "cmjtcczey0009vk1khg74cfh9",
                "createdAt": "2026-01-03T05:01:01.596Z",
                "updatedAt": "2026-01-03T05:01:01.596Z",
                "service": {
                    "id": "cmj9nvo1d0001vknktf60petq",
                    "name": "Extensiones de Pestañas",
                    "durationMin": 80,
                    "cleaningTimeMin": 0,
                    "price": 999.99,
                    "description": null,
                    "imageUrl": null,
                    "category": null,
                    "isActive": true,
                    "businessId": "cmiwg5e9w0000vkbg03hsebwf",
                    "createdAt": "2025-12-17T06:59:38.737Z",
                    "updatedAt": "2025-12-29T01:04:51.064Z"
                }
            }
        ],
        "businessClient": {
            "id": "cmiwnpnh2000avk6wazdrv2bk",
            "client": {
                "name": "Alex Edu",
                "email": null,
                "phone": "5518839216"
            }
        },
        "user": null
    },
    {
        "id": "cmjxu5u330007vk8oh9arcebb",
        "date": "2026-01-10T06:00:00.000Z",
        "startTime": "09:40",
        "endTime": "11:00",
        "durationMin": 80,
        "startTimeMinutes": 580,
        "endTimeMinutes": 660,
        "status": "SCHEDULED",
        "businessId": "cmiwg5e9w0000vkbg03hsebwf",
        "userId": null,
        "businessClientId": "cmiwnpnh2000avk6wazdrv2bk",
        "createdAt": "2026-01-03T05:01:59.056Z",
        "updatedAt": "2026-01-03T05:01:59.056Z",
        "services": [
            {
                "id": "cmjxu5u680008vk8ohzavnr6t",
                "appointmentId": "cmjxu5u330007vk8oh9arcebb",
                "serviceId": "cmj9nvo1d0001vknktf60petq",
                "userId": "cmj9np1le0001vkg8tbxui9zc",
                "createdAt": "2026-01-03T05:01:59.169Z",
                "updatedAt": "2026-01-03T05:01:59.169Z",
                "service": {
                    "id": "cmj9nvo1d0001vknktf60petq",
                    "name": "Extensiones de Pestañas",
                    "durationMin": 80,
                    "cleaningTimeMin": 0,
                    "price": 999.99,
                    "description": null,
                    "imageUrl": null,
                    "category": null,
                    "isActive": true,
                    "businessId": "cmiwg5e9w0000vkbg03hsebwf",
                    "createdAt": "2025-12-17T06:59:38.737Z",
                    "updatedAt": "2025-12-29T01:04:51.064Z"
                }
            }
        ],
        "businessClient": {
            "id": "cmiwnpnh2000avk6wazdrv2bk",
            "client": {
                "name": "Alex Edu",
                "email": null,
                "phone": "5518839216"
            }
        },
        "user": null
    },
    {
        "id": "cmjxu6hns000avk8oydtpxesi",
        "date": "2026-01-10T06:00:00.000Z",
        "startTime": "13:20",
        "endTime": "14:40",
        "durationMin": 80,
        "startTimeMinutes": 800,
        "endTimeMinutes": 880,
        "status": "SCHEDULED",
        "businessId": "cmiwg5e9w0000vkbg03hsebwf",
        "userId": null,
        "businessClientId": "cmiwh6ofm0004vkigj3f2uo5g",
        "createdAt": "2026-01-03T05:02:29.608Z",
        "updatedAt": "2026-01-03T05:02:29.608Z",
        "services": [
            {
                "id": "cmjxu6hpd000bvk8oiowe35v7",
                "appointmentId": "cmjxu6hns000avk8oydtpxesi",
                "serviceId": "cmj9nvo1d0001vknktf60petq",
                "userId": "cmj9np1le0001vkg8tbxui9zc",
                "createdAt": "2026-01-03T05:02:29.666Z",
                "updatedAt": "2026-01-03T05:02:29.666Z",
                "service": {
                    "id": "cmj9nvo1d0001vknktf60petq",
                    "name": "Extensiones de Pestañas",
                    "durationMin": 80,
                    "cleaningTimeMin": 0,
                    "price": 999.99,
                    "description": null,
                    "imageUrl": null,
                    "category": null,
                    "isActive": true,
                    "businessId": "cmiwg5e9w0000vkbg03hsebwf",
                    "createdAt": "2025-12-17T06:59:38.737Z",
                    "updatedAt": "2025-12-29T01:04:51.064Z"
                }
            }
        ],
        "businessClient": {
            "id": "cmiwh6ofm0004vkigj3f2uo5g",
            "client": {
                "name": "Manuel",
                "email": "",
                "phone": "5535287904"
            }
        },
        "user": null
    }
])
    const { token } = useUser()

    useEffect(() => {
        if(token){
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
            
            // getAppointments()

        }
    }, [token])
    

    return (
        <AppointmentContext.Provider value={{ appointments }} >
            {children}
        </AppointmentContext.Provider>
    )

}

export default AppointmentContext
export { AppointmentProvider }