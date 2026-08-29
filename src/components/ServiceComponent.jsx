import {
  CheckCircle
} from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { toast, Toaster } from "sonner"
import { z } from "zod"
import { useUser } from "@/hooks/useUser"
import { useService } from "@/hooks/useService";
import { useTeam } from "@/hooks/useTeam";

import OverviewHeader from "@/components/OverviewHeader"

const serviceSchema = z.object({
  serviceId: z.union([z.string(), z.number()]).optional(),
  name: z.string().trim().min(1, "El nombre del servicio es requerido"),
  category: z.string().optional(),
  price: z.number({ invalid_type_error: "Precio inválido" }).min(1, "El precio debe ser mayor a 0"),
  durationMin: z.number({ invalid_type_error: "Duración inválida" }).min(1, "La duración debe ser mayor a 0"),
  description: z.string().optional(),
  cleaningTimeMin: z.number({ invalid_type_error: "Tiempo de limpieza inválido" }).min(0, "El tiempo de limpieza no puede ser negativo"),
  isActive: z.boolean(),
  users: z.array(z.union([z.string(), z.number()])).min(1, "Al menos un profesional debe ser seleccionado"),
  selectedStaff: z.array(z.object({ id: z.union([z.string(), z.number()]), })).optional()
})

export default function ServiceComponent({
  id,
  editMode = false,
  name,
  setName,
  category,
  setCategory,
  price,
  setPrice,
  durationHours,
  setDurationHours,
  durationMinutes,
  setDurationMinutes,
  description,
  setDescription,
  cleaningTimeMin,
  setCleaningTimeMin,
  isActive,
  setIsActive,
  selectedStaff,
  setSelectedStaff,
}) {
  const router = useRouter()
  const { token } = useUser()
  const { refetchServices } = useService()
  const [isLoading, setIsLoading] = useState(false)
  const { team, refreshTeam } = useTeam()

  const isSelected = (staffId) => selectedStaff.some((staff) => staff.id === staffId)

  const handleStaffToggle = (staff) => {
    if (!staff?.id) return

    setSelectedStaff((current) => {
      const exists = current.some((item) => item.id === staff.id)
      if (exists) {
        return current.filter((item) => item.id !== staff.id)
      }
      return [...current, { id: staff.id, name: staff.name }]
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const payload = {
        serviceId: id,
        name,
        category,
        price: Number(price),
        durationMin: Number(durationHours) * 60 + Number(durationMinutes),
        description,
        cleaningTimeMin: Number(cleaningTimeMin),
        isActive,
        users: selectedStaff.map((staff) => staff.id),
      }
      const validation = serviceSchema.safeParse(payload)
      if (!validation.success) {
        const message = validation.error.errors
          ?.map((issue) => issue.message)
          .join(". ")

        toast.error(message || "Corrige los errores del formulario")
        setIsLoading(false)
        return
      }

      const url = editMode
        ? `/service/update`
        : `/service/create`

      if (editMode) {
        await api.put(url, validation.data, {
          headers: {
            Authorization: token,
          },
        })
        refetchServices()
      } else {
        await api.post(url, payload, {
          headers: {
            Authorization: token,
          },
        })
        // setServices(prev => [...prev, data.service])
        refetchServices()
      }
      toast.success(editMode ? "Servicio actualizado" : "Servicio creado")
      setTimeout(() => {
        router.back()
      }, 1000);
    } catch (error) {
      console.error("Error guardando servicio:", error)
      toast.error("No se pudo guardar el servicio. Intenta de nuevo.")
    }
  }

  const handleCancel = () => {
    router.back()
  }

  useEffect(() => {
    refreshTeam()
  }, [])

  return (
    <div className="min-h-screen bg-background text-[#e2e2e2] mb-10">
    <Toaster position="top-center" richColors />
    {/* HEADER */}
      <OverviewHeader />

      {/* MAIN */}
      <main className="pt-10 sm:pt-10">

        {/* HEADER */}
        <div className="px-4 sm:px-10 py-10 sm:py-12 flex flex-col lg:flex-row gap-6 lg:justify-between lg:items-end bg-gradient-to-b from-[#0e0e0e] to-transparent rounded-4xl">
          
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              {editMode ? "Editar Servicio" : "Nuevo Servicio"}
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 max-w-lg text-sm sm:text-base">
              {editMode ? "Edita los detalles de tu servicio." : "Crea un nuevo servicio."}
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
              className="px-5 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm font-bold uppercase bg-blue-600 rounded-xl text-white hover:bg-blue-800 transition cursor-pointer
              disabled:bg-blue-600/50">
              {isLoading ? "Guardando..." : editMode ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="px-4 sm:px-10 py-10 sm:py-12 max-w-5xl mx-auto space-y-10 sm:space-y-14 rounded-2xl">

          {/* SECTION 1 */}
          <Section title="Información básica" index="01" className="rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              <Input 
                label="Nombre del servicio" 
                placeholder="Ej. Ritual de Oro 24K" 
                className="rounded-xl"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {/* <Select 
                label="Categoría" 
                className="rounded-xl"
                name="category"
                value={category}
                onChange={setCategory}
              /> */}

              <Input 
                label="Precio" 
                type="number" 
                placeholder="250.00" 
                className="rounded-xl"
                name="price"
                min={0}
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
              <Input 
                label="Horas" 
                type="number" 
                placeholder="0" 
                className="rounded-xl"
                name="durationHours"
                min={0}
                value={durationHours}
                onChange={e => setDurationHours(e.target.value)}
              />
              <Input 
                label="Minutos" 
                type="number" 
                placeholder="30" 
                className="rounded-xl"
                name="durationMinutes"
                min={0}
                max={59}
                value={durationMinutes}
                onChange={e => {
                  const value = e.target.value
                  if (Number(value) > 59) return
                  setDurationMinutes(value)
                }}
              />
            </div>
          </Section>

          {/* SECTION 2 */}
          <Section title="Detalles del servicio" index="02">
            <div className="space-y-4">
              <label className="label text-neutral-400 tg">*opcional*</label>

              <div className="bg-[#0e0e0e] rounded-lg mt-2">
                <textarea 
                  name="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-transparent p-4 outline-none min-h-[120px] rounded-xl" 
                />
              </div>
            </div>
          </Section>

          {/* SECTION 3 */}
          <Section title="Configuración" index="03">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">

              <div>
                <p className="font-bold">Tiempo de limpieza</p>
                <p className="text-xs text-neutral-400">
                  Margen entre citas
                </p>
              </div>

              <div className="flex sm:justify-end items-center gap-3">
                <input
                  type="number"
                  name="cleaningTimeMin"
                  value={cleaningTimeMin}
                  onChange={e => setCleaningTimeMin(e.target.value)}
                  className="w-20 bg-secondary text-secondary-foreground rounded-l-lg p-2 text-center"
                  min={0}
                  onFocus={e => e.target.select()}
                />
                <span className="text-xs uppercase text-neutral-400">
                  min
                </span>
              </div>

              <div>
                <p className="font-bold">Servicio activo</p>
                <p className="text-xs text-neutral-400">
                  Disponible para reservas
                </p>
              </div>

              <div className="flex sm:justify-end items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`w-14 h-8 rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-neutral-700'}`} />
                  <span className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transform transition-transform ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </label>
              </div>

            </div>
          </Section>

          {/* SECTION 4 */}
          <Section title="Asignación de personal" index="04" className="mb-20">
            <div className="grid gap-3 sm:grid-cols-2">

              {team?.map((staff) => {
                const selected = isSelected(staff.id)

                return (
                  <div
                    key={`${staff.name}-${staff.id}`}
                    onClick={() => handleStaffToggle(staff)}
                    role="button"
                    tabIndex={0}
                    className={`p-5 border transition cursor-pointer flex justify-between items-center rounded-lg ${selected ? "border-blue-500 bg-blue-600/10" : "border-border hover:border-neutral-600"}`}
                  >
                    <div>
                      <p className="text-sm font-bold uppercase">
                        {staff.name}
                      </p>
                    </div>

                    <CheckCircle
                      className={`w-5 h-5 transition ${selected ? "text-blue-500" : "text-neutral-700"}`}
                    />
                  </div>
                )
              })}
            </div>
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

function Input({ label, onFocus, ...props }) {
  return (
    <div className="space-y-1">
      <label className="label text-neutral-400">{label}</label>
      <input
        {...props}
        onFocus={(e) => {
          requestAnimationFrame(() => {
            e.target.select();
          });

          onFocus?.(e);
        }}
        className="w-full bg-[#0e0e0e] p-3 sm:p-4 outline-none text-sm rounded-lg mt-2"
      />
    </div>
  )
}

function Textarea({ label, className = "", ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="label text-neutral-400">{label}</label>
      <textarea
        {...props}
        className="w-full bg-[#0e0e0e] p-3 sm:p-4 outline-none resize-none text-sm rounded-lg mt-2"
      />
    </div>
  )
}

function Select({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="label text-neutral-400">{label}</label>
      <select
        {...props}
        className="w-full bg-[#0e0e0e] p-3 sm:p-4 outline-none text-sm rounded-lg mt-2"
        disabled
      >
        <option>Selecciona una categoria</option>
        <option>Tratamientos Faciales</option>
        <option>Masajes</option>
        <option>Cuidado Corporal</option>
      </select>
    </div>
  )
}
