"use client"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import OverviewHeader from "./OverviewHeader"
import { useUser } from "@/hooks/useUser"
import { useBusiness } from "@/hooks/useBusiness"
import { Skeleton } from "@/components/ui/skeleton"
import BlockedTimesSection from "./BlockedTimesSection"
import PhoneInput from "react-phone-input-2"

export default function SettingsComponent() {
  const router = useRouter()
  const { token } = useUser()
  const { business, setBusiness } = useBusiness()

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [defaultSlotInterval, setDefaultSlotInterval] = useState(20)

  const defaultBusinessHours = {
    sunday: { open: "00:00", close: "00:00", closed: true },
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "15:00", closed: false },
  }

  const [businessHours, setBusinessHours] = useState(defaultBusinessHours)

  useEffect(() => {
    if (business) {
      setName(business.name || "")
      setEmail(business.email || "")
      setAddress(business.address || "")
      setPhone(business.phone || "")
      setDefaultSlotInterval(business.defaultSlotInterval || 20)
      if (business.businessHours) {
        setBusinessHours(business.businessHours)
      }
      setIsFetching(false)
    }
  }, [business])

  const handleSave = async () => {
    if (!name || !email || !address || !phone) {
      toast.error("Por favor completa los campos de información básica.")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        id: business.id,
        name,
        email,
        address,
        phone,
        defaultSlotInterval: Number(defaultSlotInterval),
        businessHours,
        specialDays: business.specialDays || {}
      }

      const { data } = await api.put(`/business/update`, payload, {
        headers: {
          Authorization: token,
        },
      })

      setBusiness(data.business || payload)
      toast.success("Configuración actualizada correctamente")
    } catch (error) {
      console.error("Error guardando configuración:", error)
      toast.error("No se pudo guardar la configuración. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleBusinessHourChange = (day, field, value) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: field === 'closed' ? value : value
      }
    }))
  }

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ]

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background text-[#e2e2e2] mb-10">
        <OverviewHeader />
        <main className="pt-10 sm:pt-10">
          <div className="px-4 sm:px-10 py-10 sm:py-12 flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-end">
             <Skeleton className="h-12 w-64 bg-secondary text-secondary-foreground" />
          </div>
          <div className="px-4 sm:px-10 py-10 sm:py-12 max-w-5xl mx-auto space-y-10 sm:space-y-14 rounded-2xl">
             <Skeleton className="h-48 w-full bg-secondary text-secondary-foreground" />
             <Skeleton className="h-48 w-full bg-secondary text-secondary-foreground" />
             <Skeleton className="h-64 w-full bg-secondary text-secondary-foreground" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-[#e2e2e2] mb-10">
      <Toaster position="top-center" richColors />
      <OverviewHeader />

      <main className="pt-10 sm:pt-10">
        <div className="px-4 sm:px-10 py-10 sm:py-12 flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-end bg-gradient-to-b from-[#0e0e0e] to-transparent rounded-4xl">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Configuración del Negocio
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 max-w-lg text-sm sm:text-base">
              Edita los detalles y horarios de operación de tu negocio.
            </p>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={handleCancel}
              className="bg-secondary text-secondary-foreground px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase rounded-xl hover:bg-accent hover:text-accent-foreground transition cursor-pointer">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-5 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase bg-blue-600 rounded-xl text-white hover:bg-blue-800 transition cursor-pointer disabled:bg-blue-600/50">
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>

        <div className="px-4 py-10 sm:py-12 mx-auto space-y-10 sm:space-y-14 rounded-2xl">
          <Section title="Información básica" index="01" className="rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Nombre del Negocio"
                placeholder="Ej. Gut Klinik"
                className="rounded-xl"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="correo@correo.com"
                className="rounded-xl"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                label="Dirección"
                placeholder="calzada del bone"
                className="rounded-xl"
                name="address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <div className="space-y-1">
                <label className="label text-neutral-400">Teléfono</label>
                <PhoneInput
                  country={'mx'}
                  value={phone || ""}
                  onChange={phone => setPhone(phone)}
                  inputClass="!w-full !bg-[#0e0e0e] !p-3 sm:!p-4 !pl-[48px] sm:!pl-[48px] !outline-none !text-sm !rounded-lg !mt-2 !text-foreground !border-none !h-[48px] sm:!h-[52px]"
                  buttonClass="!bg-transparent !border-none !mt-2 !pl-2"
                  dropdownClass="!bg-[#1a1a1a] !text-foreground !border-border"
                  containerClass="w-full"
                  placeholder="552405238"
                />
              </div>
            </div>
          </Section>

          <Section title="Configuración" index="02">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <p className="font-bold">Intervalo de Citas</p>
                <p className="text-xs text-neutral-400">
                  Duración predeterminada entre intervalos
                </p>
              </div>

              <div className="flex sm:justify-end items-center gap-3">
                <input
                  type="number"
                  name="defaultSlotInterval"
                  value={defaultSlotInterval}
                  onChange={e => setDefaultSlotInterval(e.target.value)}
                  className="w-20 bg-[#0e0e0e] rounded-l-lg p-3 sm:p-4 text-center text-foreground outline-none"
                  min={5}
                  step={5}
                />
                <span className="text-xs uppercase text-neutral-400">
                  min
                </span>
              </div>
            </div>
          </Section>

          <Section title="Horarios de operación" index="03">
            <div className="space-y-4">
              {daysOfWeek.map(({ key, label }) => {
                const daySchedule = businessHours[key] || { open: "09:00", close: "18:00", closed: false }

                return (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-[#0e0e0e] p-4 rounded-xl">
                    <div className="font-semibold">{label}</div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-neutral-400">Abierto</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={daySchedule.closed}
                          onChange={e => handleBusinessHourChange(key, 'closed', e.target.checked)}
                          className="sr-only peer"
                        />
                        <span className={`w-12 h-6 rounded-full transition-colors ${!daySchedule.closed ? 'bg-green-600' : 'bg-neutral-700'}`} />
                        <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform ${!daySchedule.closed ? 'translate-x-6' : 'translate-x-0'}`} />
                      </label>
                    </div>

                    {!daySchedule.closed && (
                      <>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-neutral-400">Apertura</label>
                            <input
                              type="time"
                              value={daySchedule.open}
                              onChange={e => handleBusinessHourChange(key, 'open', e.target.value)}
                              className="bg-[#1b1b1b] p-2 rounded-lg text-foreground outline-none w-full"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-neutral-400">Cierre</label>
                            <input
                              type="time"
                              value={daySchedule.close}
                              onChange={e => handleBusinessHourChange(key, 'close', e.target.value)}
                              className="bg-[#1b1b1b] p-2 rounded-lg text-foreground outline-none w-full"
                            />
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </Section>

          <Section title="Bloqueo de horario" index="04" className="rounded-xl">
             <BlockedTimesSection />
          </Section>

        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  )
}

function Section({ title, index, children, className = "" }) {
  return (
    <section className={`bg-[#1b1b1b] p-5 sm:p-8 border space-y-6 sm:space-y-8 rounded-xl border-border ${className}`}>
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

function Input({ label, className = "", ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="label text-neutral-400">{label}</label>
      <input
        {...props}
        className="w-full bg-[#0e0e0e] p-3 sm:p-4 outline-none text-sm rounded-lg mt-2 text-foreground"
      />
    </div>
  )
}
