"use client"
import api from "@/lib/api"
import { createContext, useState, useEffect } from "react"
import { refreshAccessToken, saveAccessToken, saveUser, clearUser, clearAccessToken } from "@/lib/tokenService"

const UserContext = createContext()

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)

    const clearSession = () => {
        clearUser()
        clearAccessToken()
        setToken(null)
        setUser(null)
    }

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const newToken = await refreshAccessToken()
                if (newToken) {
                    saveAccessToken(newToken)
                    setToken(newToken)

                    const { data } = await api.get('/user/get-user-by-id')
                    const userPayload = data?.user ?? data
                    const userData = {
                        id: userPayload?.id,
                        name: userPayload?.name,
                        email: userPayload?.email,
                        role: userPayload?.role,
                        businessId: userPayload?.businessId,
                        ...userPayload,
                    }

                    setUser(userData)
                    saveUser({ token: newToken, user: userData })
                } else {
                    clearSession()
                }
            } catch (error) {
                clearSession()
            } finally {
                setIsLoaded(true)
            }
        }

        initializeAuth()
    }, [])

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
