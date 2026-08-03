"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

import api from "@/lib/api"
import { useUser } from "@/hooks/useUser"
import { sanitizeString } from "@/lib/utils"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast, Toaster } from "sonner"
import { z } from "zod"

import { redirect } from "next/navigation"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { saveAccessToken, saveUser } from "@/lib/tokenService"

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const { token, setToken, isLoaded, setUser } = useUser()

  const FormSchema = z.object({
    email: z.string().email({ message: "Correo inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  })

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

    async function onSubmit(data) {
      const trimmedData = {
        email: sanitizeString(data.email),
        password: sanitizeString(data.password),
      }

      try {
        const { data: response } = await api.post(`/user/login`, trimmedData)
        setToken(`Bearer ${response.token}`)
        saveUser(response)
        saveAccessToken(response.token)

        toast.success("Login exitoso!", {
          description: `Redireccionando...`,
        })

        router.push("/main")
      } catch (error) {
        console.error(error?.response?.data?.msg || "Email o Contraseña incorrectos")
        toast.error(error?.response?.data?.msg || "Email o Contraseña incorrectos")
      }
    }

  useEffect(() => {
    if(isLoaded && token) {
        return redirect("/main")
    }
  }, [isLoaded, token])

  if(isLoaded && !token) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
        <Toaster position="top-center" richColors />
        <h1 className="text-3xl font-bold mb-8">Iniciar sesión</h1>
        <Form>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-96 p-6 bg-neutral-800 rounded-lg shadow-lg space-y-6"
            >
                {/* Email */}
                <FormField
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} autoComplete="email" />
                      </FormControl>
                      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  name="password"
                  render={({ field, fieldState }) => ( 
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            autoComplete="current-password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((value) => !value)}
                            className="absolute inset-y-0 right-2 flex items-center justify-center rounded-md px-2 text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full cursor-pointer">Iniciar sesión</Button>
            </form>
          </FormProvider>
        </Form>
            {/* <div className="mt-2 flex items-center justify-between">
              <span>No tienes cuenta aún?</span>
              <Link href="/register" className="text-blue-500 hover:underline ml-2">Regístrate</Link>
            </div> */}
      </div>
    )
  }
}
