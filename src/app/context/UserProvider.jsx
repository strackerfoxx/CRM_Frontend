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
                    "Authorization": `Bearer ${userState.token}`
                }
                try {
                    const { data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/user/get-user-by-id`, { headers })
                    setUser({name: data?.user?.name, email: data?.user?.email, id: data?.user?._id})
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




























// "use client"
// import axios from "axios"
// import { createContext, useState, useEffect, useRef } from "react"
// import {
//   saveAccessToken,
//   getAccessToken,
//   clearAccessToken,
//   saveUser,
//   getUser,
//   clearUser,
//   refreshAccessToken,
//   logout as tokenServiceLogout,
// } from "@/lib/tokenService"

// const UserContext = createContext()

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [token, setToken] = useState(null)
//   const [isLoaded, setIsLoaded] = useState(false)
//   const isRefreshing = useRef(false)
//   const failedQueue = useRef([])

//   /**
//    * Procesar la cola de peticiones que fallaron por token expirado
//    */
//   const processQueue = (error, token = null) => {
//     failedQueue.current.forEach((prom) => {
//       if (error) {
//         prom.reject(error)
//       } else {
//         prom.resolve(token)
//       }
//     })

//     failedQueue.current = []
//   }

//   /**
//    * Configurar interceptor de axios para manejar 401 y refrescar token
//    */
//   useEffect(() => {
//     const responseInterceptor = axios.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config

//         // Si es 401 (token expirado) y no es una petición de refresh/logout
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           if (isRefreshing.current) {
//             // Si ya estamos refrescando, agregar a la cola
//             return new Promise((resolve, reject) => {
//               failedQueue.current.push({ resolve, reject })
//             })
//               .then((token) => {
//                 originalRequest.headers["Authorization"] = `Bearer ${token}`
//                 return axios(originalRequest)
//               })
//               .catch((err) => {
//                 return Promise.reject(err)
//               })
//           }

//           isRefreshing.current = true
//           originalRequest._retry = true

//           try {
//             const newToken = await refreshAccessToken()
//             setToken(`Bearer ${newToken}`)
//             processQueue(null, newToken)

//             originalRequest.headers["Authorization"] = `Bearer ${newToken}`
//             return axios(originalRequest)
//           } catch (refreshError) {
//             processQueue(refreshError, null)
//             // Limpiar y redirigir al login (manejado por el componente)
//             clearAccessToken()
//             clearUser()
//             setToken(null)
//             setUser(null)
//             return Promise.reject(refreshError)
//           } finally {
//             isRefreshing.current = false
//           }
//         }

//         return Promise.reject(error)
//       }
//     )

//     // Configurar interceptor de request para agregar el token
//     const requestInterceptor = axios.interceptors.request.use(
//       (config) => {
//         const accessToken = getAccessToken()
//         if (accessToken && !config.headers.Authorization) {
//           config.headers.Authorization = `Bearer ${accessToken}`
//         }
//         config.withCredentials = true // Enviar cookies
//         return config
//       },
//       (error) => Promise.reject(error)
//     );

//     return () => {
//       axios.interceptors.response.eject(responseInterceptor)
//       axios.interceptors.request.eject(requestInterceptor)
//     }
//   }, [])

//   /**
//    * Inicializar desde localStorage
//    */
//   useEffect(() => {
//     const storedAccessToken = getAccessToken()
//     const storedUser = getUser()

//     if (storedAccessToken) {
//       setToken(`Bearer ${storedAccessToken}`)
//       if (storedUser) {
//         setUser(storedUser)
//       }
//     }

//     setIsLoaded(true)
//   }, [])

//   /**
//    * Logout: limpiar datos locales y del backend
//    */
//   const logout = async () => {
//     try {
//       await tokenServiceLogout()
//     } catch (error) {
//       console.error("Logout error:", error)
//     } finally {
//       setToken(null)
//       setUser(null)
//     }
//   }

//   /**
//    * Guardar usuario (cuando inicia sesión)
//    */
//   const updateUser = (userData) => {
//     setUser(userData)
//     saveUser(userData)
//   }

//   return (
//     <UserContext.Provider
//       value={{
//         token,
//         setToken,
//         isLoaded,
//         user,
//         setUser: updateUser,
//         logout,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   )
// }

// export default UserContext
// export { UserProvider }