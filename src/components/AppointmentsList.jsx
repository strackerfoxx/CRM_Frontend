import React from 'react'
import { dateReseter } from "@/middleware/dateReseter";
import Link from 'next/link';

import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentsList({ appointments, loading }) {
  return (
    <>
        <div className="m-5">
            <div className="bg-card rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="hidden md:grid grid-cols-5 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5 rounded-b-xl">
                    <span>Cliente</span>
                    <span>Telefono</span>
                    <span>status</span>
                    <span>Fecha</span>
                    <span>Categoria</span>
                </div>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-5 item px-6 gap-5 py-4 mb-2 border-b border-border rounded-b-2xl">
                            <Skeleton className="h-6 w-32 bg-secondary text-secondary-foreground" />
                            <Skeleton className="h-6 w-24 bg-secondary text-secondary-foreground" />
                            <Skeleton className="h-6 w-24 rounded-3xl bg-secondary text-secondary-foreground" />
                            <Skeleton className="h-6 w-24 bg-secondary text-secondary-foreground" />
                            <Skeleton className="h-6 w-24 bg-secondary text-secondary-foreground" />
                        </div>
                    ))
                ) : (
                    <>
                        {appointments.map((a) => (
                            <Link href={`/main/appointments/${a.id}`} key={a.id}
                                className="grid grid-cols-1 md:grid-cols-5 item hover:bg-accent hover:text-accent-foreground px-6 gap-5 py-4 mb-2 border-b border-border rounded-b-2xl"
                            >
                                <div className="col-name overflow-hidden truncate">{a.businessClient.client.name}</div>
                                <div className="col-phone overflow-hidden truncate">{a.businessClient.client.phone}</div>
                                <div
                                    className={` text-sm text-center py-1 rounded-3xl w-24 ${a.status === "SCHEDULED" ? "bg-amber-500/20 dark:bg-amber-100 dark:bg-amber-100 dark:bg-amber-400/60 text-amber-700 dark:text-white border border-amber-400 h-7"
                                    : a.status === "CANCELED" ? "bg-red-500/20 dark:bg-red-100 dark:bg-red-100 dark:bg-red-900/60 text-amber-700 dark:text-white border border-red-500 h-7"
                                    : a.status === "COMPLETED" ? "bg-blue-500/20 dark:bg-blue-100 dark:bg-blue-100 dark:bg-blue-900/60 text-amber-700 dark:text-white border border-blue-500" : "bg-green-500/20 dark:bg-green-100 dark:bg-green-100 dark:bg-green-900/60 text-amber-700 dark:text-white border border-green-400 h-7"}`}>
                                    {a.status === "SCHEDULED" ? "Agendada"
                                    : a.status === "CANCELED" ? "Cancelada"
                                    : a.status === "COMPLETED" ? "Completada" : "Confirmada"}
                                </div>
                                <div className="col-created overflow-hidden truncate">{dateReseter(a.date, "dd-mm-yyy")}</div>
                                <div className="col-category overflow-hidden truncate"></div>
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
