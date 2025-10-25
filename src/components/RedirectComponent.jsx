"use client"
import { redirect } from "next/navigation"
import { useUser } from "@/hooks/useUser"

export default function RedirectComponent({children}) {
    const { isLoaded, token } = useUser()

    if(isLoaded && !token) {
        return redirect("/")
    }
    if(isLoaded && token) {
        return (
            <>
                {children}
            </>
        )
    }
}
