"use client"
import api from "@/lib/api"
import { createContext, useState, useEffect } from "react"
import { refreshAccessToken, saveUser, clearUser, clearAccessToken } from "@/lib/tokenService"

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Try to refresh token using the HttpOnly cookie
                const newToken = await refreshAccessToken()
                if (newToken) {
                    setToken(`Bearer ${newToken}`)

                    const headers = {
                        "Authorization": `Bearer ${newToken}`
                    }
                    // Fetch user details with the new token
                    const { data } = await api(`${process.env.NEXT_PUBLIC_API_URL}/user/get-user-by-id`, { headers })
                    const userData = {name: data?.user?.name, email: data?.user?.email, id: data?.user?._id}
                    setUser(userData)
                    saveUser({ token: newToken, user: userData })
                }
            } catch (error) {
                // Ignore error, means user is not authenticated
            } finally {
                setIsLoaded(true)
            }
        }

        initializeAuth()
    }, [])

    const clearSession = () => {
        clearUser()
        clearAccessToken()
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
            window.location.href = '/'
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
