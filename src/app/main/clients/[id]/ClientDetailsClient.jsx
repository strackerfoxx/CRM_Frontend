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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className='col text-green-400' viewBox="0 0 256 258">
        <path fill="#25d366" d="M128.534 0c34.098.017 66.102 13.29 90.167 37.383c24.066 24.092 37.312 56.12 37.299 90.174c-.028 69.579-56.076 126.318-125.36 127.446l-2.103.017h-.053c-21.005-.007-41.65-5.194-60.051-15.045l-.86-.466L0 257.233l18.083-66.055C6.93 171.852 1.061 149.922 1.07 127.455C1.098 57.178 58.279 0 128.534 0Zm.044 21.53c-58.437 0-105.964 47.523-105.987 105.936c-.008 19.712 5.424 38.921 15.719 55.612l.478.769l2.52 4.009l-10.703 39.093l40.097-10.517l3.869 2.294c16.007 9.499 34.32 14.599 53.017 14.764l.905.004h.044c58.392 0 105.918-47.526 105.942-105.943c.01-28.308-10.998-54.927-31.001-74.952c-20.003-20.024-46.603-31.06-74.9-31.07Zm-45.17 47.063c2.122 0 4.25.02 6.104.115c1.956.096 4.581-.743 7.165 5.466c.992 2.38 2.5 6.057 4.044 9.813l.331.805c2.485 6.045 4.969 12.072 5.447 13.029c.795 1.593 1.325 3.455.264 5.579c-1.06 2.127-1.593 3.454-3.184 5.316c-1.593 1.858-3.344 4.153-4.777 5.579a57.05 57.05 0 0 0-.234.233l-.232.237c-1.42 1.469-2.608 3.153-.93 6.027c1.857 3.19 8.248 13.622 17.716 22.066c12.165 10.85 22.428 14.214 25.613 15.809c3.184 1.594 5.043 1.328 6.9-.8c1.859-2.124 7.961-9.298 10.085-12.487c2.123-3.188 4.246-2.655 7.166-1.593c1.387.505 5.654 2.511 10.092 4.649l1.38.666c4.443 2.15 8.776 4.288 10.29 5.046c3.185 1.595 5.309 2.392 6.104 3.719c.796 1.33.796 7.705-1.858 15.145c-2.653 7.44-15.378 14.23-21.497 15.146c-5.487.818-12.43 1.16-20.06-1.262c-4.624-1.47-10.558-3.429-18.157-6.71c-31.948-13.794-52.815-45.966-54.406-48.09l-.108-.144c-1.941-2.594-12.898-17.445-12.898-32.804c0-15.675 8.229-23.38 11.147-26.569c2.92-3.186 6.37-3.986 8.493-3.986Z"></path>
    </svg>
);

export default function ClientDetailsClient() {
  const { token, isLoaded } = useUser()
  const router = useRouter()
  const [ date, setDate ] = useState()
  const [ appointments, setAppointments ] = useState([])
  const [ notes, setNotes ] = useState([])
  const [ isLoading, setIsLoading ] = useState(true)
  const [ client, setClient ] = useState({})
  const [activationOpen, setActivationOpen] = useState(false)
  const [activationUrl, setActivationUrl] = useState("")
  const [isCreatingActivation, setIsCreatingActivation] = useState(false)

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

    const createActivationLink = async () => {
      setIsCreatingActivation(true)
      setActivationUrl("")
      try {
        const { data } = await api.post(`/client/${id}/activation`, {}, {
          headers: { Authorization: token },
        })
        if (!data?.activationUrl) throw new Error("No se recibió el enlace de activación")
        setActivationUrl(data.activationUrl)
      } catch (error) {
        console.error("Error al crear enlace de activación:", error)
        toast.error(error.response?.data?.msg || "No se pudo crear el enlace de verificación")
      } finally {
        setIsCreatingActivation(false)
      }
    }

    const openActivationModal = () => {
      setActivationOpen(true)
      createActivationLink()
    }

    const whatsappUrl = activationUrl
      ? `https://wa.me/${(client?.client?.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${client?.client?.name || ""}, verifica tu cuenta usando este enlace: ${activationUrl}`)}`
      : ""

  return (
<>
  <OverviewHeader />
  <Toaster position="top-center" richColors />
  <div className="px-4 py-7 mt-15 sm:px-6 lg:px-20">
    {/* Cabecera del cliente */}
    <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
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
        <div className="flex w-full flex-wrap gap-2 lg:w-auto">
          {client?.client?.isConfirmed === false && (
            <Button onClick={openActivationModal} className="h-auto min-h-9 max-w-full whitespace-normal rounded-3xl px-4 py-2 text-center font-semibold leading-tight">
              Enviar enlace de verificación
            </Button>
          )}
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

    <Dialog open={activationOpen} onOpenChange={setActivationOpen}>
      <DialogContent className="sm:max-w-md bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>Enviar enlace de verificación</DialogTitle>
          <DialogDescription>
            Genera un enlace y compártelo por WhatsApp al número registrado.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-16 items-center justify-center">
          {isCreatingActivation ? (
            <LoaderCircle className="h-7 w-7 animate-spin text-primary" aria-label="Generando enlace" />
          ) : activationUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-green-600 bg-neutral-800 px-4 py-2 font-medium text-white hover:bg-neutral-600 gap-2"
            >
              <WhatsAppIcon />
              Enviar por WhatsApp
            </a>
          ) : (
            <Button onClick={createActivationLink}>Intentar de nuevo</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>

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
                      ? "bg-amber-500/20 dark:bg-amber-400/60 ring-amber-300/40 border-amber-300 text-amber-700 dark:text-amber-300"
                      : appointment.status === "CANCELED"
                      ? "bg-red-500/20  dark:bg-red-900/60 ring-red-400/30 border-red-500 text-red-700 dark:text-red-300"
                      : appointment.status === "COMPLETED"
                      ? "bg-blue-500/20  dark:bg-blue-900/60 ring-blue-400/30 text-blue-700 dark:text-blue-300"
                      : "bg-green-500/20  dark:bg-green-900/60 ring-green-400/30 border border-green-400 text-green-700 dark:text-green-300"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      appointment.status === "SCHEDULED"
                        ? "bg-amber-500/20 dark:bg-amber-400/60 border border-amber-300"
                        : appointment.status === "CANCELED"
                        ? "bg-red-500/20  dark:bg-red-900/60 border border-red-500"
                        : appointment.status === "COMPLETED"
                        ? "bg-blue-500/20  dark:bg-blue-900/60"
                        : "bg-green-500/20  dark:bg-green-900/60 border border-green-400"
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
