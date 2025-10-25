"use client"
import axios from "axios"
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
                    "Authorization": `${userState.token}`
                }
                try {
                    // const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/users/getuser`, { headers })
                } catch (error) {
                    console.log(error.message)
                }
            }
            getUser()
        }
        setIsLoaded(true)
    }, [])
    
    return (
        <UserContext.Provider value={{ token, setToken, isLoaded, user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
export default UserContext
export { UserProvider }