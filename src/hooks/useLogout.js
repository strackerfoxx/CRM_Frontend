import { useContext } from "react"
import UserContext from "@/app/context/UserProvider"

export const useLogout = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useLogout must be used within UserProvider")
  }
  return context.logout
}
