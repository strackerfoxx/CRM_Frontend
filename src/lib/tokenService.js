import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

let inMemoryAccessToken = null;
let inMemoryUser = null;

/**
 * Guardar el accessToken en memoria
 */
export const saveAccessToken = (token) => {
  inMemoryAccessToken = token;
}

/**
 * Obtener el accessToken desde memoria
 */
export const getAccessToken = () => {
  return inMemoryAccessToken;
}

/**
 * Limpiar el accessToken en memoria
 */
export const clearAccessToken = () => {
  inMemoryAccessToken = null;
}

/**
 * Guardar datos del usuario en memoria
 */
export const saveUser = (user) => {
  inMemoryUser = user;
}

/**
 * Obtener datos del usuario desde memoria
 */
export const getUser = () => {
  return inMemoryUser;
}

/**
 * Limpiar datos del usuario en memoria
 */
export const clearUser = () => {
  inMemoryUser = null;
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
    const token = response.data.token || response.data.accessToken
    if (token) {
      saveAccessToken(token)
      return token
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
