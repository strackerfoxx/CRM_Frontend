"use client"
import axios from "axios"
import { createContext, useState, useEffect } from "react"
import { useUser } from "@/hooks/useUser"
const AppointmentContext = createContext()

const AppointmentProvider = ({children}) => {
    const [appointments, setAppointments] = useState([
    {
        "id": "cmg1fot6e0000vklse3pndz70",
        "date": "2025-01-01T00:00:00.000Z",
        "status": "SCHEDULED",
        "isActive": true,
        "businessId": "cmf0ao3p60001vk5cvqsjjud1",
        "userId": "cmf0bv1c20003vk742wm69hj5",
        "businessClientId": "cmg0ad5uk0002vkmsqtzfjp5q",
        "createdAt": "2025-09-26T22:49:05.431Z",
        "updatedAt": "2025-09-27T06:53:48.732Z",
        "services": [],
        "businessClient": {
            "id": "cmg0ad5uk0002vkmsqtzfjp5q",
            "client": {
                "name": "Alex Edu",
                "email": null,
                "phone": "5518839216"
            }
        },
        "user": {
            "name": "Admin"
        }
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
        "updatedAt": "2025-09-27T23:14:20.408Z",
        "services": [
            {
                "id": "cmg1ymeps0002vkm0z51jntlb",
                "appointmentId": "cmg1ymemp0001vkm0l7rrmqt9",
                "serviceId": "cmfxfg65p0001vk8smqj4l7jd",
                "createdAt": "2025-09-27T07:39:06.112Z",
                "updatedAt": "2025-09-27T07:39:06.112Z",
                "service": {
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
                }
            }
        ],
        "businessClient": {
            "id": "cmg0ad5uk0002vkmsqtzfjp5q",
            "client": {
                "name": "Alex Edu",
                "email": null,
                "phone": "5518839216"
            }
        },
        "user": null
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
        "updatedAt": "2025-09-28T00:48:05.350Z",
        "services": [
            {
                "id": "cmg2zdp5t0002vkqkw68416ff",
                "appointmentId": "cmg2zdp0m0001vkqk61axk9gw",
                "serviceId": "cmfxfg65p0001vk8smqj4l7jd",
                "createdAt": "2025-09-28T00:48:05.538Z",
                "updatedAt": "2025-09-28T00:48:05.538Z",
                "service": {
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
                }
            }
        ],
        "businessClient": {
            "id": "cmg0ad5uk0002vkmsqtzfjp5q",
            "client": {
                "name": "Alex Edu",
                "email": null,
                "phone": "5518839216"
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
                    const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/appointment/get-all`, { headers })
                    setAppointments(data.appointments)
                } catch (error) {
                    console.log(error.message)
                }
            }
            
            getAppointments()

        }
    }, [token])
    

    return (
        <AppointmentContext.Provider value={{appointments}} >
            {children}
        </AppointmentContext.Provider>
    )

}

export default AppointmentContext
export { AppointmentProvider }