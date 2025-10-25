import axios from 'axios'
import { notFound } from 'next/navigation'
import { dateReseter } from "@/middleware/dateReseter"

import MessageSender from "@/components/appointmentOverview/MessageSender";
import PaymentSummary from "@/components/appointmentOverview/PaymentSummary";
import InfoCard from "@/components/appointmentOverview/InfoCard";
import OverviewHeader from "@/components/OverviewHeader";


async function getAppointment(id){
    try {
        const {data: appointment} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointment/get-by-id?id=${id}`, {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZjBidjFjMjAwMDN2azc0MndtNjloajUiLCJuYW1lIjoiQWRtaW4iLCJyb2xlIjoiQURNSU4iLCJidXNpbmVzc0lkIjoiY21mMGFvM3A2MDAwMXZrNWN2cXNqanVkMSIsImlhdCI6MTc2MDIyMzIwMywiZXhwIjoxNzYyODE1MjAzfQ.6W3XJzBAaxPrRpRq-mrFZuD-GEkpaQYcIcfZZ-zGE24`
            }
        })
        return appointment
    } catch (error) {
        notFound()
    }
}

export default async function Appointment({params}) {
    const { id } = await params
    const {appointment} = await getAppointment(id)
    console.log(appointment.businessClient?.client)
  return (
    <div className="flex min-h-screen w-full flex-col font-display">
      <OverviewHeader />
      
      <main className="flex flex-1 justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl">
          
          {/* Cabecera de la Página */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white">Detalles de la Cita</h2>
                <span 
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${appointment.status === "SCHEDULED" ? "bg-amber-400/60 ring-amber-300/40 border-amber-300 text-amber-300"
                  : appointment.status === "CANCELED" ? "bg-red-900/60 ring-red-400/30 border-red-500 text-red-300"
                  : appointment.status === "COMPLETED" ? "bg-blue-900/60 ring-blue-400/30 text-blue-300" : "bg-green-900/60 ring-green-400/30 border border-green-400 text-green-300"}`}
                >
                  <span 
                    className={`h-1.5 w-1.5 rounded-full ${appointment.status === "SCHEDULED" ? "bg-amber-400/60 border border-amber-300"
                  : appointment.status === "CANCELED" ? "bg-red-900/60 border border-red-500"
                  : appointment.status === "COMPLETED" ? "bg-blue-900/60" : "bg-green-900/60 border border-green-400"}`}
                  ></span>
                  {appointment.status === "SCHEDULED" ? "Agendada"
                  : appointment.status === "CANCELED" ? "Cancelada"
                  : appointment.status === "COMPLETED" ? "Completada" : "Confirmada"}
                </span>
              </div>
              <p className="mt-1 text-neutral-400">Revisa la información de la cita programada.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-600/90 cursor-pointer">
                <span>Editar Cita</span>
              </button>
            </div>
          </div>
          
          {/* Grid Principal de Contenido */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Columna Izquierda: Detalles */}
            <div className="space-y-6 lg:col-span-2">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoCard title="Creado por" value="Admin" />
                <InfoCard title="Cliente" value={appointment.businessClient.client.name} subtitle={`Telefono: ${appointment.businessClient.client.phone}`} />
                <InfoCard title="Fecha" value={dateReseter(appointment.date, 'dd-mm-yyy')} />
                <InfoCard title="Hora" value={dateReseter(appointment.date, 'hh:mm')} />
              </div>
            </div>
            
            <div className="space-y-6">
              <PaymentSummary services={appointment.services} />
            </div>
          </div>
          
          <MessageSender client={appointment.businessClient?.client} date={dateReseter(appointment.date, 'dd-mm-yyy')} hour={dateReseter(appointment.date, 'hh:mm')} />

        </div>
      </main>
    </div>
  );
}