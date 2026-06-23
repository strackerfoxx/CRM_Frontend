import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast, Toaster } from "sonner"
import { z } from "zod"
import { useUser } from "@/hooks/useUser"
import { useBusiness } from "@/hooks/useBusiness"
import OverviewHeader from "@/components/OverviewHeader"
import { Skeleton } from "@/components/ui/skeleton"

import { useClient } from "@/hooks/useClients"
import PhoneInput from "react-phone-input-2"

const clientSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().trim().min(1, "El nombre del cliente es requerido"),
  phone: z.string().trim().min(1, "El teléfono es requerido"),
  email: z.union([z.string().email("Email inválido"), z.literal(""), z.null()]).optional(),
  businessId: z.union([z.string(), z.number()]).optional()
})

export default function ClientComponent({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  isLoading: isFetchingData = false
}) {
  const router = useRouter()
  const { token } = useUser()
  const { business } = useBusiness()
  const [isLoading, setIsLoading] = useState(false)
  const { refetchClients } = useClient()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const payload = {
        businessId: business?.id,
        name,
        phone,
        email: email || undefined,
      }

      const validation = clientSchema.safeParse(payload)

      if (!validation.success) {
        const message = validation.error.errors
          ?.map((issue) => issue.message)
          .join(". ")

        toast.error(message || "Corrige los errores del formulario")
        setIsLoading(false)
        return
      }

      const url = `/client/create`


        await api.post(url, validation.data, {
          headers: {
            Authorization: token,
          },
        })
      toast.success("Cliente creado")
      setTimeout(() => {
        router.back()
      }, 1000);

    } catch (error) {
      console.error("Error guardando cliente:", error)
      toast.error("No se pudo guardar el cliente. Intenta de nuevo.")
    } finally {
        setIsLoading(false)
        refetchClients()
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] mb-10">
    <Toaster position="top-center" richColors />
    {/* HEADER */}
      <OverviewHeader />

      {/* MAIN */}
      <main className="pt-10 sm:pt-10">

        {/* HEADER */}
        <div className="px-4 sm:px-10 py-10 sm:py-12 flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-end bg-gradient-to-b from-[#0e0e0e] to-transparent rounded-4xl">

          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              {"Nuevo Cliente"}
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 max-w-lg text-sm sm:text-base">
              {"Crea un nuevo cliente."}
            </p>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={handleCancel}
              className="bg-neutral-800 px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase rounded-xl hover:bg-neutral-900 transition cursor-pointer">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-5 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase bg-blue-600 rounded-xl text-white hover:bg-blue-800 transition cursor-pointer
              disabled:bg-blue-600/50">
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="px-4 sm:px-10 py-10 sm:py-12 max-w-5xl mx-auto space-y-10 sm:space-y-14 rounded-2xl">

          {/* SECTION 1 */}
          <Section title="Información básica" index="01" className="rounded-xl">
            {isFetchingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                   <Skeleton className="h-5 w-24 bg-neutral-800" />
                   <Skeleton className="h-12 w-full rounded-xl bg-neutral-800" />
                </div>
                <div className="space-y-2">
                   <Skeleton className="h-5 w-24 bg-neutral-800" />
                   <Skeleton className="h-12 w-full rounded-xl bg-neutral-800" />
                </div>
                <div className="space-y-2">
                   <Skeleton className="h-5 w-24 bg-neutral-800" />
                   <Skeleton className="h-12 w-full rounded-xl bg-neutral-800" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label="Nombre del cliente"
                  placeholder="Ej. Juan Pérez"
                  className="rounded-xl"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />

                <div className="space-y-1">
                  <label className="label text-neutral-400">Teléfono</label>
                  <PhoneInput
                    country={'mx'}
                    value={phone}
                    onChange={phone => setPhone(phone)}
                    inputClass="!w-full !bg-[#0e0e0e] !p-3 sm:!p-4 !pl-[48px] sm:!pl-[48px] !outline-none !text-sm !rounded-lg !mt-2 !text-white !border-none !h-[48px] sm:!h-[52px]"
                    buttonClass="!bg-transparent !border-none !mt-2 !pl-2"
                    dropdownClass="!bg-[#1a1a1a] !text-white !border-neutral-800"
                    containerClass="w-full"
                    placeholder="Ej. 555 123 4567"
                  />
                </div>

                <Input
                  label="Email (opcional)"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="rounded-xl"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            )}
          </Section>

        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  )
}

function Section({ title, index, children }) {
  return (
    <section className="bg-[#1b1b1b] p-5 sm:p-8 border space-y-6 sm:space-y-8 rounded-xl">
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 px-3 py-1 bg-blue-400/10 rounded-full">
          {index}
        </span>
        <h3 className="text-lg sm:text-2xl font-bold">
          {title}
        </h3>
      </div>
      {children}
    </section>
  )
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="label text-neutral-400">{label}</label>
      <input
        {...props}
        className="w-full bg-[#0e0e0e] p-3 sm:p-4 outline-none text-sm rounded-lg mt-2"
      />
    </div>
  )
}
