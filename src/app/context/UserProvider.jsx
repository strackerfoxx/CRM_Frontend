"use client"
import api from "@/lib/api"
import { createContext, useState, useEffect } from "react"
const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
      if (localStorage.getItem("user")) {
            const userState = JSON.parse(localStorage.getItem("user"))
            setToken(`Bearer ${userState.token}`)
            setUser(userState.user)

            const getUser = async () => {
                const headers = {
                    "Authorization": `Bearer ${userState.token}`
                }
                try {
                    const { data } = await api(`${process.env.NEXT_PUBLIC_API_URL}/user/get-user-by-id`, { headers })
                    setUser({name: data?.user?.name, email: data?.user?.email, id: data?.user?._id})
                } catch (error) {
                    console.error(error.message)
                }
            }
            getUser()
        }
        setIsLoaded(true)
    }, [])

    const clearSession = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("accessToken")
        setToken(null)
        setUser(null)
    }

    const logout = async () => {
        try {
            await api.post('/user/logout');
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            clearSession()
            window.location.href = '/login'
        }
    }

    return (
        <UserContext.Provider value={{ token, setToken, isLoaded, user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    )
}
export default UserContext
export { UserProvider }
