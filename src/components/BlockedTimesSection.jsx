"use client"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import { toast } from "sonner"
import { useUser } from "@/hooks/useUser"
import { useProfessionals } from "@/hooks/useProfessionals"
import { dateReseter } from "@/middleware/dateReseter" 

export default function BlockedTimesSection() {
    const { token } = useUser()
    const { professionals } = useProfessionals()
    const [blockedTimes, setBlockedTimes] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form state
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)
    const [date, setDate] = useState("")
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [userId, setUserId] = useState("")

    const fetchBlockedTimes = async () => {
        setIsLoading(true)
        try {
            const { data } = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/blocked-time/get-blocked-times`, {
                headers: {
                    Authorization: token,
                },
            })
            // Extract the blocked times array assuming data contains an array or data.blockedTimes
            setBlockedTimes(data.blockedTimes || data || [])
        } catch (error) {
            console.error("Error fetching blocked times:", error)
            toast.error("Error al cargar los tiempos bloqueados")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchBlockedTimes()
        }
    }, [token])

    const resetForm = () => {
        setIsEditing(false)
        setEditId(null)
        setDate("")
        setStart("")
        setEnd("")
        setUserId("")
    }

    const handleEdit = (bt) => {
        setIsEditing(true)
        setEditId(bt._id || bt.id)
        setDate(bt.date ? bt.date.split('T')[0] : "")
        setStart(bt.start || "")
        setEnd(bt.end || "")
        setUserId(bt.userId || "")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!date || !start || !end) {
            toast.error("Fecha, hora de inicio y fin son obligatorios")
            return
        }

        // Validate time format and start < end
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(start) || !timeRegex.test(end)) {
            toast.error("Formato de hora inválido (HH:mm)")
            return
        }

        const parseToMinutes = (hour) => {
            const [h, m] = hour.split(':').map(Number);
            return h * 60 + m;
        }

        if (parseToMinutes(end) <= parseToMinutes(start)) {
            toast.error("La hora de fin debe ser mayor a la de inicio")
            return
        }

        setIsSaving(true)
        try {
            const payload = {
                date, // Input type="date" yields YYYY-MM-DD which is a valid ISO8601 part, backend might expect full ISO or handle it
                start,
                end,
                ...(userId && { userId })
            }

            if (isEditing) {
                payload.id = editId
                await api.put(`${process.env.NEXT_PUBLIC_API_URL}/blocked-time/update`, payload, {
                    headers: { Authorization: token },
                })
                toast.success("Tiempo bloqueado actualizado")
            } else {
                await api.post(`${process.env.NEXT_PUBLIC_API_URL}/blocked-time/create`, payload, {
                    headers: { Authorization: token },
                })
                toast.success("Tiempo bloqueado creado")
            }

            resetForm()
            fetchBlockedTimes()
        } catch (error) {
            console.error("Error saving blocked time:", error)
            toast.error(error.response?.data?.message || "Error al guardar el tiempo bloqueado")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <h4 className="text-xl font-bold">Tiempos Bloqueados</h4>
            <p className="text-sm text-neutral-400">
                Bloquea horarios específicos para evitar reservas. Puedes bloquear para un profesional o para todos (dejando vacío).
            </p>

            <form onSubmit={handleSubmit} className="bg-[#0e0e0e] p-4 sm:p-6 rounded-xl space-y-4">
                <h5 className="font-semibold mb-4">{isEditing ? "Editar bloqueo" : "Nuevo bloqueo"}</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Fecha *</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-[#1b1b1b] p-2 text-sm outline-none rounded-lg text-white"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Inicio (HH:mm) *</label>
                        <input
                            type="time"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="w-full bg-[#1b1b1b] p-2 text-sm outline-none rounded-lg text-white"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Fin (HH:mm) *</label>
                        <input
                            type="time"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="w-full bg-[#1b1b1b] p-2 text-sm outline-none rounded-lg text-white"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-neutral-400">Profesional (Opcional)</label>
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-[#1b1b1b] p-2 text-sm outline-none rounded-lg text-white"
                        >
                            <option value="">Todos</option>
                            {professionals?.map(p => (
                                <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-3 justify-end mt-4">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 text-xs font-bold bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-4 py-2 text-xs font-bold bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isSaving ? "Guardando..." : (isEditing ? "Actualizar" : "Guardar")}
                    </button>
                </div>
            </form>

            {isLoading ? (
                <p>Cargando tiempos bloqueados...</p>
            ) : (
                <div className="space-y-4">
                    {blockedTimes.map((bt) => (
                        <div key={bt.id || bt._id} className="bg-[#0e0e0e] p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{dateReseter(bt.date, "dd-mm-yyy")}</p>
                                <p className="text-sm text-neutral-400">
                                    {bt.start} - {bt.end}
                                </p>
                            </div>
                            {bt.userId && (
                                <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">
                                    {professionals?.find(p => p.id === bt.userId || p._id === bt.userId)?.name || bt.userId}
                                </span>
                            )}
                            <button
                                onClick={() => handleEdit(bt)}
                                className="ml-4 px-3 py-1 bg-neutral-800 text-xs rounded-lg hover:bg-neutral-700 transition"
                            >
                                Editar
                            </button>
                        </div>
                    ))}
                    {blockedTimes.length === 0 && (
                        <p className="text-sm text-neutral-500">No hay tiempos bloqueados configurados.</p>
                    )}
                </div>
            )}
        </div>
    )
}
