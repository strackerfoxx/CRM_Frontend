import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast, Toaster } from "sonner"
import { z } from "zod"
import { useUser } from "@/hooks/useUser"

import OverviewHeader from "@/components/OverviewHeader"

const professionalSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  email: z.string().trim().email("Debe ser un email válido"),
  role: z.string().trim().min(1, "El rol es requerido"),
  phone: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  businessId: z.string().optional().nullable(),
})

export default function ProfessionalComponent({
  id,
  editMode = false,
  name,
  setName,
  email,
  setEmail,
  role,
  setRole,
  phone,
  setPhone,
  password,
  setPassword,
  businessId,
  schedules = [],
  setSchedules
}) {
  const router = useRouter()
  const { token } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)

    try {
      const payload = {
        name,
        email,
        role,
        phone,
      }

      if (!editMode) {
        payload.password = password
        payload.businessId = businessId
      } else {
        payload.id = id
      }

      const validation = professionalSchema.safeParse(payload)

      if (!validation.success) {
        const message = validation.error.errors
          ?.map((issue) => issue.message)
          .join(". ")

        toast.error(message || "Corrige los errores del formulario")
        setIsLoading(false)
        return
      }

      const url = editMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/user/update-user`
        : `${process.env.NEXT_PUBLIC_API_URL}/user/create`

      if (editMode) {
        await axios.put(url, validation.data, {
          headers: {
            Authorization: token,
          },
        })

        if (schedules && schedules.length > 0) {
            for (const schedule of schedules) {
                 if (schedule.id) {
                     await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/update-schedule`, {
                         id: schedule.id,
                         dayOfWeek: schedule.dayOfWeek,
                         startTime: schedule.startTime,
                         endTime: schedule.endTime
                     }, {
                         headers: {
                             Authorization: token,
                         }
                     })
                 }
            }
        }
      } else {
        await axios.post(url, validation.data, {
          headers: {
            Authorization: token,
          },
        })
      }
      toast.success(editMode ? "Profesional actualizado" : "Profesional creado")
      setTimeout(() => {
        router.back()
      }, 1000);
    } catch (error) {
      console.error("Error guardando profesional:", error)
      toast.error("No se pudo guardar el profesional. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2] mb-10">
      <Toaster position="top-center" richColors />
      <OverviewHeader />

      <main className="pt-10 sm:pt-10">
        <div className="px-4 sm:px-10 py-10 sm:py-12 flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-end bg-gradient-to-b from-[#0e0e0e] to-transparent rounded-4xl">

          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              {editMode ? "Editar Profesional" : "Nuevo Profesional"}
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 max-w-lg text-sm sm:text-base">
              {editMode ? "Edita los detalles del profesional." : "Crea un nuevo profesional."}
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
              className="px-5 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase bg-blue-600 rounded-xl text-white hover:bg-blue-800 transition cursor-pointer disabled:bg-blue-600/50">
              {isLoading ? "Guardando..." : editMode ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-10 py-10 sm:py-12 max-w-5xl mx-auto space-y-10 sm:space-y-14 rounded-2xl">
          <Section title="Información básica" index="01" className="rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Nombre"
                placeholder="Ej. Marcos - Manicurista"
                className="rounded-xl"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                placeholder="ejemplo@correo.com"
                className="rounded-xl"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Input
                label="Teléfono"
                placeholder="+123456789"
                className="rounded-xl"
                name="phone"
                value={phone || ""}
                onChange={e => setPhone(e.target.value)}
              />
              <Select
                label="Rol"
                className="rounded-xl"
                name="role"
                value={role}
                onChange={e => setRole(e.target.value)}
                options={[
                    { value: "EMPLOYEE", label: "Empleado" },
                    { value: "ADMIN", label: "Administrador" }
                ]}
              />
              {!editMode && (
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="********"
                  className="rounded-xl"
                  name="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              )}
            </div>
          </Section>

          {editMode && schedules.length > 0 && (
              <Section title="Horarios" index="02">
                <div className="space-y-4">
                  {schedules.map((schedule, index) => (
                    <div key={schedule.id || index} className="grid grid-cols-3 gap-4 items-center bg-[#0e0e0e] p-4 rounded-xl">
                       <div className="font-bold capitalize">{schedule.dayOfWeek}</div>
                       <Input
                            label="Hora Inicio"
                            type="time"
                            value={schedule.startTime}
                            onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                        />
                        <Input
                            label="Hora Fin"
                            type="time"
                            value={schedule.endTime}
                            onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                        />
                    </div>
                  ))}
                </div>
              </Section>
          )}

        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  )
}

function Section({ title, index, children }) {
  return (
    <section className="bg-[#1b1b1b] p-5 sm:p-8 border space-y-6 sm:space-y-8 rounded-xl border-neutral-800">
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
        className="w-full bg-[#0e0e0e] p-3 sm:p-4 outline-none text-sm rounded-lg mt-2 text-white"
      />
    </div>
  )
}

function Select({ label, options, ...props }) {
  return (
    <div className="space-y-1">
      <label className="label text-neutral-400">{label}</label>
      <select
        {...props}
        className="w-full bg-[#0e0e0e] p-3 sm:p-4 outline-none text-sm rounded-lg mt-2 text-white"
      >
        <option value="">Selecciona un rol</option>
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
