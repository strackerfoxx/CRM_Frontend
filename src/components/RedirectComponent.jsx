"use client"
import { useEffect } from "react";
import { redirect } from "next/navigation"
import { useUser } from "@/hooks/useUser"

export default function RedirectComponent({children}) {
    const { isLoaded, token } = useUser()

    useEffect(() => {
        if(isLoaded && !token) {
            return redirect("/")
        }
    }, [isLoaded, token])
    if(isLoaded && token) {
        return (
            <>
                {children}
            </>
        )
    }
}
