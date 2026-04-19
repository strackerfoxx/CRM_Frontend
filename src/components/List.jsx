"use client"

import { useEffect } from "react";

import axios from "axios";

import { useUser } from "@/hooks/useUser";

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react";
import Link from "next/link";
import "@/css/list.css"

export default function List({appointments}) {
    // const [date, setDate] = useState(new Date());
    const [date, setDate] = useState();
    const { token } = useUser()
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);

    useEffect(() => {
      const getAppointmentsByDate = async (date) => {
        const { data } = await 
        axios(`${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-params?startDate=${date}&page=1&limit=20`, 
        {
            headers: {
              Authorization: token,
            },
        })
        setFilteredAppointments(data.appointments)
      }
      if(date && token){ 
        getAppointmentsByDate(new Date(date).toISOString())
      }else{
        setFilteredAppointments(appointments)
      }

    }, [date])
    

  return (
    <div className="list-screen m-5">
      <div className="bg-neutral-900 rounded-2xl font-semibold">
        <div className="list-grid header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
          <span>Hora</span>
          <span>Estado</span>
          <span>Cliente</span>
          <span>Servicios</span>
        </div>

        {filteredAppointments.map((appointment) => (
          <Link href={`/main/appointment/${appointment.id}`} key={appointment.id} 
            className="list-grid item hover:bg-neutral-800 px-6 py-4 mt-2 border-b rounded-b-xl border-b-neutral-700"
          >
            <div className="col-time">{appointment.startTime}</div>
            {console.log(appointment.date)}
            <div className="col-status">
              <div 
                className={` text-sm text-center py-1 rounded-3xl w-24 ${appointment.status === "SCHEDULED" ? "bg-amber-400/60 text-white border border-amber-400 h-7"
                  : appointment.status === "CANCELED" ? "bg-red-900/60 text-white border border-red-500 h-7"
                  : appointment.status === "COMPLETED" ? "bg-blue-900/60 text-white border border-blue-500" : "bg-green-900/60 text-white border border-green-400 h-7"}`}>
                {appointment.status === "SCHEDULED" ? "Agendada"
                  : appointment.status === "CANCELED" ? "Cancelada"
                  : appointment.status === "COMPLETED" ? "Completada" : "Confirmada"}
              </div>
            </div>
            <div className="col-user">{appointment.businessClient.client.name}</div>
            <div className="col-services">{appointment?.services?.[0]?.service?.name || "-"}</div>
          </Link>
        ))}
      </div>

       <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg bg-neutral-900"
        />
    </div>
  )
}
