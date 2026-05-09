"use client"

import { useParams } from "next/navigation";

import axios from "axios";
import { useEffect, useState } from "react";

import { dateReseter } from "@/middleware/dateReseter";
import { useUser } from "@/hooks/useUser";

import OverviewHeader from "@/components/OverviewHeader";
import { Calendar } from "@/components/ui/calendar";
import InfoCard from "@/components/appointmentOverview/InfoCard";

import Link from "next/link";

export default function ClientDetailsClient() {
  const { token, isLoaded } = useUser()
  const [ date, setDate ] = useState()
  const [ appointments, setAppointments ] = useState([])
  const [ notes, setNotes ] = useState([])
  const [ newNote, setNewNote ] = useState("")
  const [ isCreatingNote, setIsCreatingNote ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)
  const [ client, setClient ] = useState({})

  const id = useParams()?.id

    useEffect(() => {
      if(!isLoaded) return;
      if(!id) return;
      
      const getClient = async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/client/get-client-by-id?id=${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(data?.client)
        setClient(data?.client ?? null)
      }

      const getAppointments = async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-client-id?clientId=${id}&page=1&limit=20`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setAppointments(data?.appointments ?? [])
        console.log(data?.appointments)
      }
      getClient()
      getAppointments()

      setIsLoading(false)

      const getNotes = async () => {

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/note/get-notes?clientId=${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setNotes(data?.notes ?? null)
        console.log(data?.notes)
      }
      getNotes()


    }, [id, token, isLoaded])
    const appointmentDates = []

    appointments?.forEach(appointment => {
      appointmentDates.push(new Date(appointment.date))
    })


    const handleCreateNote = async () => {
      if (!newNote.trim()) return;
      setIsCreatingNote(true);
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/note/create`,
          {
            clientId: id,
            content: newNote
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        if (data && data.note) {
          setNotes(prevNotes => [data.note, ...prevNotes]);
          setNewNote("");
        }
      } catch (error) {
        console.error("Error creating note", error);
      } finally {
        setIsCreatingNote(false);
      }
    };

    useEffect(() => {
      const getAppointmentsByDate = async (date) => {
        const { data } = await 
        axios(`${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-params?startDate=${date}&clientId=${id}&page=1&limit=20`, 
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
    

  return (
    <>
      <OverviewHeader />
      <div className="px-20 py-7 mt-15">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-bold mb-3">{client?.client?.name}</h1>
                <span className=" text-neutral-500">Cliente desde el {dateReseter(client?.client?.createdAt, "dd-mm-yyy")}</span>
            </div>
            <button className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Editar cliente</button>
        </div>

        <div className="lg:flex flex-1 gap-6 mt-10">
          <div className="space-y-6 lg:flex-1 ">
            <div className="bg-neutral-900 rounded-lg p-8 flex flex-col gap-4">
                <span>Nombre</span>
                <span className="text-neutral-500">{client?.client?.name}</span>
                <span>Creado el</span>
                <span className="text-neutral-500">{dateReseter(client?.client?.createdAt, "dd-mm-yyy")}</span>
                <span>Telefono</span>
                <span className="text-neutral-500">{client?.client?.phone}</span>
            </div>
          </div>

          <div className="space-y-6 mt-10 lg:mt-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{
                appointments: appointmentDates,
              }}
              modifiersClassNames={{
                appointments:
                  "bg-primary/20 text-primary rounded-md",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-10">
              <div className="bg-neutral-900 rounded-md p-6 flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Agregar nota</h3>
                <textarea name="notes" id="notes" 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full h-[150px] bg-neutral-950 text-white rounded-md p-4"></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleCreateNote}
                    disabled={isCreatingNote}
                    className="bg-blue-600 p-2 rounded-3xl font-semibold px-4 disabled:opacity-50"
                  >
                    {isCreatingNote ? "Guardando..." : "Guardar nota"}
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900 rounded-md p-6 flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Notas</h3>
                <div className="space-y-4 overflow-y-scroll max-h-[150px] pr-2">

                  {notes?.map(note => (
                    <div key={note.id} className="bg-neutral-950 p-4 rounded-md">
                      <p className="text-sm text-neutral-400 my-2">{dateReseter(note.updatedAt, "dd-mm-yyy")}</p>
                      <p className="text-white">{note.content}</p>
                    </div>
                  ))}   

                </div>
              </div>
        </div>

        <div className="bg-neutral-900 rounded-md mt-10 mb-16">
          <h3 className="text-lg font-semibold p-6">Historial de citas</h3>
          <div className="grid grid-cols-4 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                <span>Fecha</span>
                <span>Servicio</span>
                <span>Estado</span>
                <span>Monto</span>
            </div>
            {appointments?.map(appointment => (
                <Link href={`/main/appointments/${appointment.id}`} key={appointment.id} 
                    className="grid grid-cols-4 item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                >
                    <div className="col-name overflow-hidden">{dateReseter(appointment.date, "dd-mm-yyy")}</div>
                    <div className="col-phone overflow-hidden">{appointment.services[0]?.service.name || "N/A"}</div>
                    <div className="col-email overflow-hidden">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
                          appointment.status === "SCHEDULED"
                            ? "bg-amber-400/60 ring-amber-300/40 border-amber-300 text-amber-300"
                            : appointment.status === "CANCELED"
                              ? "bg-red-900/60 ring-red-400/30 border-red-500 text-red-300"
                              : appointment.status === "COMPLETED"
                                ? "bg-blue-900/60 ring-blue-400/30 text-blue-300"
                                : "bg-green-900/60 ring-green-400/30 border border-green-400 text-green-300"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            appointment.status === "SCHEDULED"
                              ? "bg-amber-400/60 border border-amber-300"
                              : appointment.status === "CANCELED"
                                ? "bg-red-900/60 border border-red-500"
                                : appointment.status === "COMPLETED"
                                  ? "bg-blue-900/60"
                                  : "bg-green-900/60 border border-green-400"
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

                    <div className="col-created overflow-hidden">${appointment.amount?.toFixed(2) || "0.00"}</div>
                </Link>
              ))
            }
        </div>
      </div>
            <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </>
  )
}
