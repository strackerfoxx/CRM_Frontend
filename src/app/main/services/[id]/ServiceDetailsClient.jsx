"use client"

import { useParams } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";
import { useEffect, useState } from "react";

import { dateReseter } from "@/middleware/dateReseter";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";

import OverviewHeader from "@/components/OverviewHeader";

import {
  ChevronRight,
  User,
  History,
} from "lucide-react"
import { DeleteModal } from "@/components/modals/DeleteModal";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

export default function ServiceDetailsClient() {
  const { id } = useParams();
  const { token, isLoaded } = useUser()
  const router = useRouter()
  const [ service, setService ] = useState({})
  const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
      if(!isLoaded) return;
      if(!id) return;
      
      const getService = async () => {
        try {
          const { data } = await api.get(
            `/service/get-service-by-id?id=${id}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setService(data?.service ?? {})
        } catch (error) {
          console.error("Failed to fetch service:", error)
          setService({})
        } finally {
          setIsLoading(false)
        }
      }

      getService()
    }, [id, token, isLoaded])

    const handleDelete = async () => {
      try {
        await api.delete(`/service/delete-service`, {
          data: { id },
          headers: {
            Authorization: token,
          },
        });
        toast.success("El servicio se eliminó correctamente");
        router.push("/main/services");
      } catch (error) {
        console.error("Error al eliminar servicio:", error);
        toast.error("Error al eliminar el servicio");
      }
    }

  return (
    <div className="min-h-screen bg-black text-[#e2e2e2]">
      <Toaster position="top-center" richColors />
      {/* HEADER */}
      <OverviewHeader />

      {/* MAIN */}
      <main className="pt-24 sm:pt-32 pb-32 max-w-5xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <div className="space-y-6">
            <section className="mb-14 sm:mb-20">
              <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-10 w-32 rounded-3xl" />
              </div>

              <Skeleton className="h-20 sm:h-28 lg:h-32 rounded-3xl mb-8" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#1b1b1b] p-5 sm:p-6 rounded-lg flex flex-col gap-3"
                  >
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </section>

            <section className="p-5 sm:p-8 bg-[#0e0e0e] rounded-xl mb-4">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-3/4 max-w-2xl" />
              </div>
            </section>

            <section className="p-5 sm:p-8 bg-[#1f1f1f] rounded-xl mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 sm:gap-4 p-4 bg-[#2a2a2a] rounded-lg"
                  >
                    <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-4 ml-auto" />
                  </div>
                ))}
              </div>
            </section>

            <details className="group bg-[#0e0e0e] rounded-xl border border-neutral-800">
              <summary className="flex items-center justify-between p-5 sm:p-8 cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-4" />
              </summary>

              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <div className="grid gap-6 sm:grid-cols-2 border-t border-neutral-800 pt-6">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </div>
            </details>
          </div>
        ) : (
          <>
            {/* HERO */}
            <section className="mb-14 sm:mb-20 overflow-x-hidden ">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3 block">
                  Servicio Seleccionado
                </span>
                <div className="flex gap-2">
                  <Link href={`/main/services/edit/${id}`} className="bg-blue-600 p-2 rounded-3xl font-semibold px-4 hover:bg-blue-700 cursor-pointer flex items-center justify-center">
                    Editar servicio
                  </Link>
                  <DeleteModal
                    title="¿Eliminar servicio?"
                    description="Esta acción es permanente e irreversible. ¿Estás seguro de que quieres eliminar este servicio?"
                    onDelete={handleDelete}
                    triggerLabel="Eliminar"
                  />
                </div>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold leading-tight mb-8 sm:mb-12 break-words overflow-hidden">
                {service.name || "Service Name"}
              </h1>

              {/* GRID RESPONSIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {[
                  { label: "Precio", value: service?.price ? `$${service.price}` : "N/A" },
                  { label: "Duración", value: service.durationMin ? `${service.durationMin}m` : "N/A" },
                  { label: "Tiempo entre citas", value: service.cleaningTimeMin + "m" },
                  { label: "Categoria", value: service?.category || "Sin Categoria", highlight: true }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#1b1b1b] p-5 sm:p-6 rounded-lg flex flex-col gap-2"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">
                      {item.label}
                    </span>

                    {item.highlight ? (
                      <span className="flex items-center gap-2 text-lg sm:text-xl font-bold text-green-400">
                        {item.value}
                      </span>
                    ) : (
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="p-5 sm:p-8 bg-[#0e0e0e] rounded-xl mb-4">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Service Overview
              </h3>

              <p className="text-neutral-300 leading-relaxed text-sm sm:text-base max-w-2xl">
                {service.description || "No description provided for this service."}
              </p>
            </section>

            {/* TEAM */}
            <section className="p-5 sm:p-8 bg-[#1f1f1f] rounded-xl mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 sm:mb-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">
                    Assigned Team
                  </h3>
                  <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                    Specialists certified for this service type.
                  </p>
                </div>

                <button className="text-xs uppercase tracking-widest text-white border-b border-white/30 pb-1 w-fit">
                  Manage Crew
                </button>
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {service?.users?.map((user, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 sm:gap-4 p-4 bg-[#2a2a2a] rounded-lg hover:bg-[#393939] transition cursor-pointer"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-800 flex items-center justify-center">
                      <User className="text-neutral-500 w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {user.user.name}
                      </p>
                      {/* <p className="text-xs text-neutral-500">
                        {user.role}
                      </p> */}
                    </div>

                    <ChevronRight className="ml-auto text-neutral-600" />
                  </div>
                ))}
              </div>
            </section>

            {/* METADATA */}
            <details className="group bg-[#0e0e0e] rounded-xl border border-neutral-800">
              <summary className="flex items-center justify-between p-5 sm:p-8 cursor-pointer">
                <div className="flex items-center gap-3 sm:gap-4">
                  <History className="text-neutral-500 w-5 h-5" />
                  <h3 className="text-lg sm:text-xl font-bold">
                    System Metadata
                  </h3>
                </div>

                <span className="transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>

              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <div className="grid gap-6 sm:grid-cols-2 border-t border-neutral-800 pt-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                      Created At
                    </span>
                    <p className="text-sm sm:text-base">
                      {dateReseter(service?.createdAt, "dd-mm-yyy") || "N/A"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                      Updated At
                    </span>
                    <p className="text-sm sm:text-base">
                      {dateReseter(service?.updatedAt, "dd-mm-yyy") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </details>
          </>
        )}
      </main>



      <div className="fixed bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  )
}