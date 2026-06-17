import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast, Toaster } from "sonner"
import { z } from "zod"
import { useUser } from "@/hooks/useUser"
import { useBusiness } from "@/hooks/useBusiness"

import OverviewHeader from "@/components/OverviewHeader"
import PhoneInput from "react-phone-input-2"

const professionalSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
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
  const { business } = useBusiness()
  const [isLoading, setIsLoading] = useState(false)

  const DAYS_OF_WEEK = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ]

  const getAvailableDays = () => {
    if (!business?.businessHours) return DAYS_OF_WEEK
    return DAYS_OF_WEEK.filter(day => !business.businessHours[day.key]?.closed)
  }

  const getBusinessHours = (day) => {
    if (!business?.businessHours || !business.businessHours[day]) {
      return { open: '00:00', close: '23:59' }
    }
    return business.businessHours[day]
  }

  const validateScheduleHours = (dayOfWeek, startTime, endTime) => {
    const businessHours = getBusinessHours(dayOfWeek)
    if (businessHours.closed) return { valid: false, error: 'Este día está cerrado' }
    
    if (startTime < businessHours.open) {
      return { valid: false, error: `La hora de inicio no puede ser antes de ${businessHours.open}` }
    }
    if (endTime > businessHours.close) {
      return { valid: false, error: `La hora de fin no puede ser después de ${businessHours.close}` }
    }
    if (startTime >= endTime) {
      return { valid: false, error: 'La hora de inicio debe ser anterior a la hora de fin' }
    }
    return { valid: true }
  }

  const addSchedule = () => {
    const defaultDay = getAvailableDays()[0]?.key || 'monday'
    const businessHours = getBusinessHours(defaultDay)
    const newSchedule = {
      dayOfWeek: defaultDay,
      startTime: businessHours.open,
      endTime: businessHours.close,
      isNew: true,
    }
    setSchedules([...schedules, newSchedule])
  }

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
        await api.patch(url, validation.data, {
          headers: {
            Authorization: token,
          },
        })

        if (schedules && schedules.length > 0) {
            for (const schedule of schedules) {
                const validation = validateScheduleHours(schedule.dayOfWeek, schedule.startTime, schedule.endTime)
                if (!validation.valid) {
                  toast.error(`${schedule.dayOfWeek}: ${validation.error}`)
                  setIsLoading(false)
                  return
                }
                if (schedule.id) {
                     await api.put(`${process.env.NEXT_PUBLIC_API_URL}/user/update-schedule`, {
                         id: schedule.id,
                         dayOfWeek: schedule.dayOfWeek,
                         startTime: schedule.startTime,
                         endTime: schedule.endTime
                     }, {
                         headers: {
                             Authorization: token,
                         }
                     })
                 } else if (schedule.isNew) {
                     await api.post(`${process.env.NEXT_PUBLIC_API_URL}/user/create-schedule`, {
                         userId: id,
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
        await api.post(url, validation.data, {
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

  const handleDelete = async (id) => {
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/delete-schedule`, {
        data: { id },
        headers: {
          Authorization: token,
        },
      })
      
      toast.success("Horario eliminado correctamente")
    } catch (error) {
      toast.error("No se pudo eliminar el horario. Intenta de nuevo.")
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
              <div className="space-y-1">
                <label className="label text-neutral-400">Teléfono</label>
                <PhoneInput
                  country={'mx'}
                  value={phone || ""}
                  onChange={phone => setPhone(phone)}
                  inputClass="!w-full !bg-[#0e0e0e] !p-3 sm:!p-4 !pl-[48px] sm:!pl-[48px] !outline-none !text-sm !rounded-lg !mt-2 !text-white !border-none !h-[48px] sm:!h-[52px]"
                  buttonClass="!bg-transparent !border-none !mt-2 !pl-2"
                  dropdownClass="!bg-[#1a1a1a] !text-white !border-neutral-800"
                  containerClass="w-full"
                  placeholder="+123456789"
                />
              </div>
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

          {editMode && (
              <Section title="Horarios" index="02">
                <div className="space-y-4">
                  {schedules && schedules.length > 0 && schedules.map((schedule, index) => {
                    const businessHours = getBusinessHours(schedule.dayOfWeek)
                    const availableDays = getAvailableDays()
                    return (
                      <div key={schedule.id || `new-${index}`} className="grid grid-cols-4 gap-4 items-end bg-[#0e0e0e] p-4 rounded-xl">
                         <Select
                            label="Día"
                            value={schedule.dayOfWeek}
                            onChange={(e) => handleScheduleChange(index, "dayOfWeek", e.target.value)}
                            options={availableDays.map(day => ({ value: day.key, label: day.label }))}
                         />
                         <Input
                              label="Hora Inicio"
                              type="time"
                              value={schedule.startTime}
                              min="08:00"
                              max="18:00"
                              onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                          />
                          <Input
                              label="Hora Fin"
                              type="time"
                              min="09:00"
                              max="18:00"
                              value={schedule.endTime}
                              onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                          />
                          <button
                            onClick={() => {
                              handleDelete(schedule.id)
                              const newSchedules = schedules.filter((_, i) => i !== index)
                              setSchedules(newSchedules)
                            }}
                            className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition text-sm font-semibold"
                          >
                            Eliminar
                          </button>
                      </div>
                    )
                  })}
                  <button
                    onClick={addSchedule}
                    className="w-full mt-4 px-4 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition font-semibold"
                  >
                    + Agregar Horario
                  </button>
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
        <option value="">Selecciona</option>
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}
            </option>
        ))}
      </select>
    </div>
  )
}
