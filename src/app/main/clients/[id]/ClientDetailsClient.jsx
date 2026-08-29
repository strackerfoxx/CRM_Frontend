"use client"

import { useParams } from "next/navigation";

import api from "@/lib/api";
import { useEffect, useState } from "react";

import { dateReseter } from "@/middleware/dateReseter";
import { useUser } from "@/hooks/useUser";

import OverviewHeader from "@/components/OverviewHeader";
import { Calendar } from "@/components/ui/calendar";
import InfoCard from "@/components/appointmentOverview/InfoCard";
import NotesComponent from "@/components/NotesComponent";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

import Link from "next/link";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { useRouter } from "next/navigation";

export default function ClientDetailsClient() {
  const { token, isLoaded } = useUser()
  const router = useRouter()
  const [ date, setDate ] = useState()
  const [ appointments, setAppointments ] = useState([])
  const [ notes, setNotes ] = useState([])



  const [ isLoading, setIsLoading ] = useState(true)
  const [ client, setClient ] = useState({})

  const id = useParams()?.id

  

    useEffect(() => {
      if(!isLoaded) return;
      if(!id) return;
      
      const getClient = async () => {
        const { data } = await api.get(
          `/client/get-client-by-id?id=${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setClient(data?.client ?? null)
      }

      const getAppointments = async () => {
        const { data } = await api.get(
          `/appointment/get-appointments-by-client-id?clientId=${id}&page=1&limit=20`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setAppointments(data?.appointments ?? [])
      }
      getClient()
      getAppointments()

      const getNotes = async () => {

        const { data } = await api.get(
          `/note/get-notes?clientId=${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setNotes(data?.notes ?? null)
      }
      getNotes()

      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }, [id, token, isLoaded])
    const appointmentDates = []

    appointments?.forEach(appointment => {
      appointmentDates.push(new Date(appointment.date))
    })


    useEffect(() => {
      const getAppointmentsByDate = async (date) => {
        const { data } = await 
        api(`/appointment/get-appointments-by-params?startDate=${date}&clientId=${id}&page=1&limit=20`,
        {
            headers: {
              Authorization: token,
            },
        })
        setAppointments(data.appointments)
      }
      if(date && token){ 
        getAppointmentsByDate(new Date(date).toISOString())
      }

    }, [date])
    
    const handleDelete = async () => {
      try {
        await api.delete(`/client/delete-client`, {
          data: { id },
          headers: {
            Authorization: token,
          },
        });
        toast.success("El cliente se eliminó correctamente");
        router.push("/main/clients");
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        toast.error("Error al eliminar el cliente");
      }
    }

  return (
<>
  <OverviewHeader />
  <Toaster position="top-center" richColors />
  <div className="px-20 py-7 mt-15">
    {/* Cabecera del cliente */}
    <div className="flex justify-between items-center">
      <div>
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-64 mb-3 bg-secondary text-secondary-foreground" />
            <Skeleton className="h-5 w-48 bg-secondary text-secondary-foreground" />
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-3">{client?.client?.name}</h1>
            <span className=" text-neutral-500">
              Cliente desde el {dateReseter(client?.client?.createdAt, "dd-mm-yyy")}
            </span>
          </>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-10 w-36 rounded-3xl bg-secondary text-secondary-foreground" />
      ) : (
        <div className="flex gap-2">
          <Link href={`/main/clients/edit/${id}`} className="bg-blue-600 p-2 rounded-3xl font-semibold px-4 flex items-center justify-center">
            Editar cliente
          </Link>
          <DeleteModal
            title="¿Eliminar cliente?"
            description="Esta acción es permanente e irreversible. ¿Estás seguro de que quieres eliminar a este cliente?"
            onDelete={handleDelete}
            triggerLabel="Eliminar"
          />
        </div>
      )}
    </div>

    <div className="lg:flex flex-1 gap-6 mt-10">
      {/* Información del cliente */}
      <div className="space-y-6 lg:flex-1 ">
        <div className="bg-card rounded-lg p-8 flex flex-col gap-4">
          <span>Nombre</span>
          {isLoading ? (
            <Skeleton className="h-5 w-3/4 bg-secondary text-secondary-foreground" />
          ) : (
            <span className="text-neutral-500">{client?.client?.name}</span>
          )}

          <span>Creado el</span>
          {isLoading ? (
            <Skeleton className="h-5 w-1/2 bg-secondary text-secondary-foreground" />
          ) : (
            <span className="text-neutral-500">
              {dateReseter(client?.client?.createdAt, "dd-mm-yyy")}
            </span>
          )}

          <span>Telefono</span>
          {isLoading ? (
            <Skeleton className="h-5 w-1/2 bg-secondary text-secondary-foreground" />
          ) : (
            <span className="text-neutral-500">{client?.client?.phone}</span>
          )}
        </div>
      </div>

      {/* Calendario */}
      <div className="space-y-6 mt-10 lg:mt-0">
        {isLoading ? (
          <Skeleton className="w-[300px] h-[320px] rounded-lg bg-card" />
        ) : (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={{
              appointments: appointmentDates,
            }}
            modifiersClassNames={{
              appointments: "bg-primary/20 text-primary rounded-md",
            }}
          />
        )}
      </div>
    </div>

    <NotesComponent notes={notes} setNotes={setNotes} id={id} isLoading={isLoading} />

    {/* Historial de citas */}
    <div className="bg-card rounded-md mt-10 mb-16 overflow-x-auto">
      <h3 className="text-lg font-semibold p-6 min-w-[600px]">Historial de citas</h3>
      <div className="grid grid-cols-4 header text-neutral-400 font-semibold mb-2 border-b border-border pb-2 p-5 min-w-[600px]">
        <span>Fecha</span>
        <span>Servicio</span>
        <span>Estado</span>
        <span>Monto</span>
      </div>

      {isLoading
        ? // Skeletons para las filas de la tabla (mostrando 4 filas falsas)
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-4 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-800 min-w-[600px]"
            >
              <Skeleton className="h-5 w-24 bg-secondary text-secondary-foreground" />
              <Skeleton className="h-5 w-32 bg-secondary text-secondary-foreground" />
              <Skeleton className="h-6 w-28 rounded-full bg-secondary text-secondary-foreground" />
              <Skeleton className="h-5 w-16 bg-secondary text-secondary-foreground" />
            </div>
          ))
        : appointments?.map((appointment) => (
            <Link
              href={`/main/appointments/${appointment.id}`}
              key={appointment.id}
              className="grid grid-cols-4 item hover:bg-accent hover:text-accent-foreground px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl min-w-[600px]"
            >
              <div className="col-name overflow-hidden">
                {dateReseter(appointment.date, "dd-mm-yyy")}
              </div>
              <div className="col-phone overflow-hidden">
                {appointment.services[0]?.service.name || "N/A"}
              </div>
              <div className="col-email overflow-hidden">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                    appointment.status === "SCHEDULED"
                      ? "bg-amber-500/20 dark:bg-amber-100 dark:bg-amber-100 dark:bg-amber-100 dark:bg-amber-400/60 ring-amber-300/40 border-amber-300 text-amber-700 dark:text-amber-300"
                      : appointment.status === "CANCELED"
                      ? "bg-red-500/20 dark:bg-red-100 dark:bg-red-100 dark:bg-red-100 dark:bg-red-900/60 ring-red-400/30 border-red-500 text-red-700 dark:text-red-300"
                      : appointment.status === "COMPLETED"
                      ? "bg-blue-500/20 dark:bg-blue-100 dark:bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/60 ring-blue-400/30 text-blue-700 dark:text-blue-300"
                      : "bg-green-500/20 dark:bg-green-100 dark:bg-green-100 dark:bg-green-100 dark:bg-green-900/60 ring-green-400/30 border border-green-400 text-green-700 dark:text-green-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      appointment.status === "SCHEDULED"
                        ? "bg-amber-500/20 dark:bg-amber-100 dark:bg-amber-100 dark:bg-amber-100 dark:bg-amber-400/60 border border-amber-300"
                        : appointment.status === "CANCELED"
                        ? "bg-red-500/20 dark:bg-red-100 dark:bg-red-100 dark:bg-red-100 dark:bg-red-900/60 border border-red-500"
                        : appointment.status === "COMPLETED"
                        ? "bg-blue-500/20 dark:bg-blue-100 dark:bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/60"
                        : "bg-green-500/20 dark:bg-green-100 dark:bg-green-100 dark:bg-green-100 dark:bg-green-900/60 border border-green-400"
                    }`}
                  ></span>
                  {appointment.status === "SCHEDULED"
                    ? "Agendada"
                    : appointment.status === "CANCELED"
                    ? "Cancelada"
                    : appointment.status === "COMPLETED"
                    ? "Completada"
                    : "Confirmada"}
                </span>
              </div>
              <div className="col-created overflow-hidden">
                ${appointment.amount?.toFixed(2) || "0.00"}
              </div>
            </Link>
          ))}
    </div>
  </div>
  <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
</>
  )
}
