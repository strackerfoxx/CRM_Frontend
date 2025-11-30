"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const BusinessContext = createContext()

const BusinessProvider = ({ children }) => {
    const [business, setBusiness] = useState(
        {
    "id": "cmf0ao3p60001vk5cvqsjjud1",
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
            "closed": true
        },
        "tuesday": {
            "open": "09:00",
            "close": "18:00",
            "closed": false
        },
        "saturday": {
            "open": "10:00",
            "close": "14:00",
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
    "specialDays": null,
    "isActive": true,
    "createdAt": "2025-08-31T23:01:05.748Z",
    "updatedAt": "2025-08-31T23:02:44.965Z",
    "users": [
        {
            "id": "cmf0bv1c20003vk742wm69hj5",
            "name": "Admin",
            "phone": null,
            "email": "correo@correo.com",
            "password": "$2b$10$1fbmz4gz0eI1V812hRpBUuv8Vdtikf3aAJoPDbTDk.QIRUWOpe25.",
            "role": "ADMIN",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "createdAt": "2025-08-31T23:34:28.942Z",
            "updatedAt": "2025-08-31T23:34:28.942Z"
        }
    ],
    "clients": [
        {
            "id": "cmf0jkqer0002vkd4d5dfkb19",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "clientId": "cmf0jkqbr0000vkd4vx6yel3c",
            "createdAt": "2025-09-01T03:10:25.203Z",
            "updatedAt": "2025-09-01T03:10:25.203Z",
            "client": {
                "id": "cmf0jkqbr0000vkd4vx6yel3c",
                "name": "Pepe",
                "email": null,
                "phone": "552405238",
                "token": null,
                "isConfirmed": false,
                "createdAt": "2025-09-01T03:10:25.096Z",
                "updatedAt": "2025-09-01T03:10:25.096Z"
            },
            "notes": []
        },
        {
            "id": "cmfknuy9l0002vk8kr4h3eyak",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "clientId": "cmfknuy540000vk8kz8f00epg",
            "createdAt": "2025-09-15T05:05:43.929Z",
            "updatedAt": "2025-09-15T05:05:43.929Z",
            "client": {
                "id": "cmfknuy540000vk8kz8f00epg",
                "name": "Pepe",
                "email": null,
                "phone": "5517739222",
                "token": null,
                "isConfirmed": false,
                "createdAt": "2025-09-15T05:05:43.761Z",
                "updatedAt": "2025-09-15T05:05:43.761Z"
            },
            "notes": []
        },
        {
            "id": "cmg0ad5uk0002vkmsqtzfjp5q",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "clientId": "cmg0ad5rj0000vkmsh31qwasq",
            "createdAt": "2025-09-26T03:32:17.756Z",
            "updatedAt": "2025-09-26T03:32:17.756Z",
            "client": {
                "id": "cmg0ad5rj0000vkmsh31qwasq",
                "name": "Alex Edu",
                "email": null,
                "phone": "5518839216",
                "token": null,
                "isConfirmed": true,
                "createdAt": "2025-09-26T03:32:17.647Z",
                "updatedAt": "2025-09-26T03:32:33.315Z"
            },
            "notes": [
                {
                    "id": "cmg3aqlkv0001vkykl6rk7m1g",
                    "content": "El cliente prefiere no charla y una botella de agua",
                    "isActive": true,
                    "businessClientId": "cmg0ad5uk0002vkmsqtzfjp5q",
                    "createdAt": "2025-09-28T06:06:03.168Z",
                    "updatedAt": "2025-09-28T06:06:03.168Z"
                },
                {
                    "id": "cmg3asa9c0003vkyknhoqfjbp",
                    "content": "El cliente cumple años el 10 de septiembre",
                    "isActive": true,
                    "businessClientId": "cmg0ad5uk0002vkmsqtzfjp5q",
                    "createdAt": "2025-09-28T06:07:21.775Z",
                    "updatedAt": "2025-09-28T06:15:44.726Z"
                }
            ]
        }
    ],
    "services": [
        {
            "id": "cmfxfg65p0001vk8smqj4l7jd",
            "name": "Tratamiento de Keratina",
            "durationMin": 30,
            "price": 999.99,
            "description": null,
            "isActive": true,
            "imageUrl": null,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "createdAt": "2025-09-24T03:31:17.677Z",
            "updatedAt": "2025-09-24T03:54:54.325Z"
        },
        {
            "id": "cmh2z6vld0001vkb02wbha853",
            "name": "Corte de Cabello",
            "durationMin": 25,
            "price": 150,
            "description": null,
            "isActive": true,
            "imageUrl": null,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "createdAt": "2025-10-23T05:22:29.500Z",
            "updatedAt": "2025-10-23T05:22:29.500Z"
        },
        {
            "id": "cmh2z8u0n0003vkb0t1tnsgg0",
            "name": "Aplicacion de tinte",
            "durationMin": 25,
            "price": 150,
            "description": null,
            "isActive": true,
            "imageUrl": null,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "createdAt": "2025-10-23T05:24:00.792Z",
            "updatedAt": "2025-10-23T05:24:00.792Z"
        },
        {
            "id": "cmh2z9ft40005vkb0fc6jl1k4",
            "name": "Alaciado permanente",
            "durationMin": 60,
            "price": 700,
            "description": null,
            "isActive": true,
            "imageUrl": null,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "createdAt": "2025-10-23T05:24:29.074Z",
            "updatedAt": "2025-10-23T05:24:29.074Z"
        },
        {
            "id": "cmh2z9xsg0007vkb0eyki2nel",
            "name": "Extensiones de Pestañas",
            "durationMin": 80,
            "price": 1200,
            "description": null,
            "isActive": true,
            "imageUrl": null,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "createdAt": "2025-10-23T05:24:52.383Z",
            "updatedAt": "2025-10-23T05:24:52.383Z"
        }
    ],
    "appointments": [
        {
            "id": "cmg1fot6e0000vklse3pndz70",
            "date": "2025-01-01T00:00:00.000Z",
            "status": "SCHEDULED",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "userId": "cmf0bv1c20003vk742wm69hj5",
            "businessClientId": "cmg0ad5uk0002vkmsqtzfjp5q",
            "createdAt": "2025-09-26T22:49:05.431Z",
            "updatedAt": "2025-09-27T06:53:48.732Z"
        },
        {
            "id": "cmg1ymemp0001vkm0l7rrmqt9",
            "date": "2025-12-01T23:00:00.000Z",
            "status": "CANCELED",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "userId": null,
            "businessClientId": "cmg0ad5uk0002vkmsqtzfjp5q",
            "createdAt": "2025-09-27T07:39:06.001Z",
            "updatedAt": "2025-09-27T23:14:20.408Z"
        },
        {
            "id": "cmg2zdp0m0001vkqk61axk9gw",
            "date": "2025-12-01T22:00:00.000Z",
            "status": "SCHEDULED",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "userId": null,
            "businessClientId": "cmg0ad5uk0002vkmsqtzfjp5q",
            "createdAt": "2025-09-28T00:48:05.350Z",
            "updatedAt": "2025-09-28T00:48:05.350Z"
        },
        {
            "id": "cmh2zce6i0009vkb0mto3mi00",
            "date": "2025-10-31T18:00:00.000Z",
            "status": "COMPLETED",
            "isActive": true,
            "businessId": "cmf0ao3p60001vk5cvqsjjud1",
            "userId": null,
            "businessClientId": "cmg0ad5uk0002vkmsqtzfjp5q",
            "createdAt": "2025-10-23T05:26:46.986Z",
            "updatedAt": "2025-10-23T05:48:25.620Z"
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
                    console.log(error.message)
                }
            }
            // getBusiness()

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