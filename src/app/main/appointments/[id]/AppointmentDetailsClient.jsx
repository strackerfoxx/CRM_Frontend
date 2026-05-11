"use client";

import { useParams } from "next/navigation";

import { useEffect, useState } from "react";
import axios from "axios";

import { dateReseter } from "@/middleware/dateReseter";
import { useUser } from "@/hooks/useUser";
import { useDrawer } from "@/hooks/useDrawer";

import MessageSender from "@/components/appointmentOverview/MessageSender";
import PaymentSummary from "@/components/appointmentOverview/PaymentSummary";
import InfoCard from "@/components/appointmentOverview/InfoCard";
import OverviewHeader from "@/components/OverviewHeader";
import Drawer from "@/components/Drawer";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppointmentDetailsClient() {
  const { token, isLoaded } = useUser();
  const { closeDrawer, setOpen } = useDrawer();

  const [appointment, setAppointment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [client, setClient] = useState(undefined);
  const [date, setDate] = useState(undefined);
  const [servicesSelected, setServicesSelected] = useState([]);
  const [profesional, setProfesional] = useState(undefined);
  const [hour, setHour] = useState(undefined);
  
  const id = useParams()?.id
  
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!token) {
      setError("No se encontró una sesión activa.");
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const getAppointment = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-id?id=${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (!isActive) {
          return;
        }

        setAppointment(data?.appointment ?? null);
        setError("");
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError("No se pudo cargar la cita. Intenta nuevamente.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    getAppointment();
    
    return () => {
      isActive = false;
    };
  }, [id, token, isLoaded]);

  const handleEditClick = () => {
    setOpen(true);
  };

  if (!isLoading && (error || !appointment)) {
    return (
      <div className="flex min-h-screen w-full flex-col font-display">
        <OverviewHeader />
        <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
          <p className="text-sm text-red-300">{error || "Cita no encontrada."}</p>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col font-display">
        <OverviewHeader />
        <main className="flex flex-1 justify-center p-4 sm:p-6 md:p-8 mt-15">
          <div className="w-full max-w-4xl">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
            <Skeleton className="h-32 w-full mt-6" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col font-display">
      <OverviewHeader />

      <Drawer
        title="Editar cita"
        description="Modifica los detalles de la cita. Haz click en guardar cuando termines."
        label="Actualizar cita"
        mode="edit"
        appointment={appointment}
        client={client}
        setClient={setClient}
        date={date}
        setDate={setDate}
        servicesSelected={servicesSelected}
        setServicesSelected={setServicesSelected}
        profesional={profesional}
        setProfesional={setProfesional}
        hour={hour}
        setHour={setHour}
      />

      <main className="flex flex-1 justify-center p-4 sm:p-6 md:p-8 mt-15">
        <div className="w-full max-w-4xl">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white">Detalles de la Cita</h2>
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
              <p className="mt-1 text-neutral-400">
                Revisa la información de la cita programada.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-blue-600/90 cursor-pointer"
              >
                <span>Editar Cita</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoCard title="Creado por" value="Admin" />
                <InfoCard
                  title="Cliente"
                  value={appointment.businessClient.client.name}
                  subtitle={`Telefono: ${appointment.businessClient.client.phone}`}
                />
                <InfoCard
                  title="Fecha"
                  value={dateReseter(appointment.date, "dd-mm-yyy")}
                />
                <InfoCard
                  title="Hora"
                  value={dateReseter(appointment.startTime, "hh:mm")}
                />
              </div>

              <div className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                <h3 className="mb-4 text-lg font-semibold text-white">Servicios Asignados</h3>
                <div className="space-y-3">
                  {appointment.services?.map((service) => (
                    <div key={service.id} className="flex items-center justify-between rounded-md border border-neutral-700 bg-neutral-900 p-3">
                      <div>
                        <p className="font-medium text-white">{service.service?.name}</p>
                        <p className="text-sm text-neutral-400">${service.service?.price} • {service.service?.durationMin} min</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-400">{service.user?.name || "Sin asignar"}</p>
                        <p className="text-xs text-neutral-500">Profesional</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <PaymentSummary services={appointment.services} />
            </div>
          </div>

          <MessageSender appointment={appointment} />
        </div>
      </main>
    </div>
  );
}
