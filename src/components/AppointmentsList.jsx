import React from 'react'
import { dateReseter } from "@/middleware/dateReseter";
import Link from 'next/link';

import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentsList({ appointments, loading }) {
  return (
    <>
        <div className="m-5">
            <div className="bg-neutral-900 rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="grid grid-cols-5 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5 rounded-b-xl">
                    <span>Cliente</span>
                    <span>Telefono</span>
                    <span>status</span>
                    <span>Fecha</span>
                    <span>Categoria</span>
                </div>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-5 item px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl">
                            <Skeleton className="h-6 w-32 bg-neutral-700" />
                            <Skeleton className="h-6 w-24 bg-neutral-700" />
                            <Skeleton className="h-6 w-24 rounded-3xl bg-neutral-700" />
                            <Skeleton className="h-6 w-24 bg-neutral-700" />
                            <Skeleton className="h-6 w-24 bg-neutral-700" />
                        </div>
                    ))
                ) : (
                    <>
                        {appointments.map((a) => (
                            <Link href={`/main/appointments/${a.id}`} key={a.id}
                                className="grid grid-cols-5 item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                            >
                                <div className="col-name overflow-hidden">{a.businessClient.client.name}</div>
                                <div className="col-phone overflow-hidden">{a.businessClient.client.phone}</div>
                                <div
                                    className={` text-sm text-center py-1 rounded-3xl w-24 ${a.status === "SCHEDULED" ? "bg-amber-400/60 text-white border border-amber-400 h-7"
                                    : a.status === "CANCELED" ? "bg-red-900/60 text-white border border-red-500 h-7"
                                    : a.status === "COMPLETED" ? "bg-blue-900/60 text-white border border-blue-500" : "bg-green-900/60 text-white border border-green-400 h-7"}`}>
                                    {a.status === "SCHEDULED" ? "Agendada"
                                    : a.status === "CANCELED" ? "Cancelada"
                                    : a.status === "COMPLETED" ? "Completada" : "Confirmada"}
                                </div>
                                <div className="col-created overflow-hidden">{dateReseter(a.date, "dd-mm-yyy")}</div>
                                <div className="col-category overflow-hidden"></div>
                            </Link>
                        ))}
                        {appointments.length === 0 && (
                            <div className="text-center text-neutral-500 py-10">
                                No hay citas para mostrar
                            </div>
                        )}
                    </>
                )}
                
            </div>
        </div>
    </>
  )
}
