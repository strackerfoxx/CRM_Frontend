import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Guardar el accessToken en localStorage
 */
export const saveAccessToken = (token) => {
  localStorage.setItem("accessToken", token)
}

/**
 * Obtener el accessToken desde localStorage
 */
export const getAccessToken = () => {
  return localStorage.getItem("accessToken")
}

/**
 * Limpiar el accessToken de localStorage
 */
export const clearAccessToken = () => {
  localStorage.removeItem("accessToken")
}

/**
 * Guardar datos del usuario en localStorage
 */
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user))
}

/**
 * Obtener datos del usuario desde localStorage
 */
export const getUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

/**
 * Limpiar datos del usuario
 */
export const clearUser = () => {
  localStorage.removeItem("user")
}

/**
 * Refrescar el accessToken usando el refreshToken (en cookie httpOnly)
 */
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/user/refresh`,
      {},
      {
        withCredentials: true, // Enviar cookies
      }
    )
    const { accessToken } = response.data
    if (accessToken) {
      saveAccessToken(accessToken)
      return accessToken
    }
  } catch (error) {
    console.error("Error refreshing token:", error)
    clearAccessToken()
    clearUser()
    throw error
  }
}

/**
 * Realizar logout en el backend y limpiar datos locales
 */
export const logout = async () => {
  try {
    await axios.post(
      `${API_URL}/user/logout`,
      {},
      {
        withCredentials: true, // Enviar cookies
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
  } catch (error) {
    console.error("Error during logout:", error)
  } finally {
    clearAccessToken()
    clearUser()
  }
}
