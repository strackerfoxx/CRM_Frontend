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

import axios from "axios"
import { useUser } from "@/hooks/useUser"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast, Toaster } from "sonner"
import { z } from "zod"

import Link from "next/link"
import { redirect } from "next/navigation"

export default function LoginForm() {

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

    try {
      const { data: response } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, data)
      setToken(`Bearer ${response.token}`)
      localStorage.setItem("user", JSON.stringify(response))

      toast.success("Login exitoso!", {
        description: `Redireccionando...`,
      })

      router.push("/main")
    } catch (error) {
      console.log(error?.response?.data?.msg || "Email o Contraseña incorrectos")
      toast.error(error?.response?.data?.msg || "Email o Contraseña incorrectos")
    }
  }

  if(isLoaded && token) {
    return redirect("/main")
  }

  if(isLoaded && !token) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
        <Toaster position="top-center" richColors />
        <h1 className="text-3xl font-bold mb-8">Iniciar sesión</h1>
        <Form>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-96 p-6 bg-neutral-950 rounded-lg shadow-lg space-y-6"
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
                        <Input type="password" {...field} autoComplete="current-password" />
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
