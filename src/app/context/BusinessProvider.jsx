"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const BusinessContext = createContext()

const BusinessProvider = ({ children }) => {
    const [business, setBusiness] = useState(
{
    "id": "cmiwg5e9w0000vkbg03hsebwf",
    "name": "Gut Klinik",
    "address": "calzada del bone",
    "phone": "552405238",
    "email": "correo@correo.com",
    "plan": "ADVANCED",
    "businessHours": {
        "friday": {
            "open": "09:00",
            "close": "18:00",
            "closed": false
        },
        "monday": {
            "open": "09:00",
            "close": "18:00",
            "closed": false
        },
        "sunday": {
            "open": "00:00",
            "close": "00:00",
            "closed": true
        },
        "tuesday": {
            "open": "09:00",
            "close": "18:00",
            "closed": false
        },
        "saturday": {
            "open": "10:00",
            "close": "15:00",
            "closed": false
        },
        "thursday": {
            "open": "09:00",
            "close": "18:00",
            "closed": false
        },
        "wednesday": {
            "open": "09:00",
            "close": "18:00",
            "closed": false
        }
    },
    "specialDays": {},
    "defaultSlotInterval": 20,
    "deletedAt": null,
    "createdAt": "2025-12-08T01:02:15.428Z",
    "updatedAt": "2026-01-03T05:47:19.825Z",
    "users": [
        {
            "id": "cmiwg8x520002vkbgnl98uclr",
            "name": "Klinik Admin",
            "phone": null,
            "email": "correo@correo.com",
            "password": "$2b$10$eq0sKM3G0mFy.1GohlDiGuPXLLGIFM3h6pj3yIdGyhZKr7uiOxoAi",
            "role": "ADMIN",
            "deletedAt": null,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "createdAt": "2025-12-08T01:04:59.846Z",
            "updatedAt": "2025-12-08T04:22:29.998Z"
        },
        {
            "id": "cmj9np1le0001vkg8tbxui9zc",
            "name": "Romina - Estilista",
            "phone": null,
            "email": "rom@correo.com",
            "password": "$2b$10$cJX6nc1SGWnQ42CLrgxnEeBVJ1.gL8CvvExbtSJGLRri0UXvgZa8u",
            "role": "EMPLOYEE",
            "deletedAt": null,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "createdAt": "2025-12-17T06:54:29.697Z",
            "updatedAt": "2025-12-17T06:54:29.697Z"
        },
        {
            "id": "cmjtcczey0009vk1khg74cfh9",
            "name": "Ana",
            "phone": null,
            "email": "ana@gmail.com",
            "password": "$2b$10$eq0sKM3G0mFy.1GohlDiGuPXLLGIFM3h6pj3yIdGyhZKr7uiOxoAi",
            "role": "EMPLOYEE",
            "deletedAt": null,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "createdAt": "2025-12-31T01:32:34.763Z",
            "updatedAt": "2025-12-31T01:31:39.307Z"
        },
        {
            "id": "cmjxq09740001vkfkef3c4dhd",
            "name": "Marcos - Manicurista",
            "phone": null,
            "email": "marcos13@gmail.com",
            "password": "$2b$10$HJUtwiA9ma.DDYhqQPDfXeYncekwYLloJK5YbqfudljQkzjBxc5CG",
            "role": "EMPLOYEE",
            "deletedAt": null,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "createdAt": "2026-01-03T03:05:40.240Z",
            "updatedAt": "2026-01-03T03:05:40.240Z"
        }
    ],
    "services": [
        {
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
        },
        {
            "id": "cmjqgy1k20001vkz8znvhubyp",
            "name": "Nanoplastia",
            "durationMin": 150,
            "cleaningTimeMin": 0,
            "price": 4500,
            "description": null,
            "imageUrl": null,
            "category": null,
            "isActive": true,
            "businessId": "cmiwg5e9w0000vkbg03hsebwf",
            "createdAt": "2025-12-29T01:17:36.821Z",
            "updatedAt": "2026-01-03T05:39:37.985Z"
        }
    ]
}
)
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