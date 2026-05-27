"use client"
import axios from "axios"
import { cn } from "@/lib/utils"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import ServiceCard from "@/components/ServiceCard"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { toast } from "sonner"

import { DateTimePicker } from "@/components/DateTimePicker"
import Schedule from "@/components/Schedule"

import { useBusiness } from "@/hooks/useBusiness"
import { useClient } from "@/hooks/useClients"
import { useUser } from "@/hooks/useUser"
import { useService } from "@/hooks/useService"
import { useDrawer } from "@/hooks/useDrawer"
import { useAppointment } from "@/hooks/useAppointment"

import { useEffect, useState, useMemo } from "react"

export default function CreateAppointmentForm({
  label = "Guardar",
  client,
  setClient,
  date,
  setDate,
  servicesSelected,
  setServicesSelected,
  profesional,
  setProfesional,
  hour,
  setHour,
  appointment,
  getAppointment,
  mode = "create",
}) {
  const { business } = useBusiness()
  const { clients } = useClient()
  const { services } = useService()
  const { setAppointments } = useAppointment()
  const { closeDrawer } = useDrawer()
  const { token, user } = useUser()

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(appointment?.status ?? "SCHEDULED")
  const [serviceUsers, setServiceUsers] = useState({})
  const [availableUsers, setAvailableUsers] = useState({})

  useEffect(() => {
    if (!appointment) {
      return
    }

    const appointmentClientId =
      appointment?.businessClientId ?? appointment?.businessClient?.id ?? appointment?.businessClient?.client?.id

    setClient(appointmentClientId)
    setDate(appointment?.date ? new Date(appointment.date) : undefined)
    setHour(appointment?.startTime ?? undefined)

    const selectedServices = appointment?.services?.map((item) => item?.service?.id ?? item?.serviceId) ?? []
    setServicesSelected(selectedServices)

    const defaultProfessional =
      appointment?.services?.[0]?.user?.id ?? appointment?.services?.[0]?.userId ?? profesional
    setProfesional(defaultProfessional)

    setStatus(appointment?.status ?? "SCHEDULED")

    const prefilledUsers = {}
    appointment?.services?.forEach((item) => {
      const serviceId = item?.service?.id ?? item?.serviceId
      const userId = item?.user?.id ?? item?.userId ?? defaultProfessional
      if (serviceId) {
        prefilledUsers[serviceId] = userId
      }
    })
    setServiceUsers(prefilledUsers)
  }, [appointment])

  useEffect(() => {
    if (!profesional) {
      return
    }

    setServiceUsers((prev) => {
      const next = { ...prev }
      servicesSelected.forEach((serviceId) => {
        if (!next[serviceId]) {
          next[serviceId] = profesional
        }
      })
      return next
    })
  }, [servicesSelected, profesional])

  const updateServiceUser = (serviceId, userId) => {
    setServiceUsers((prev) => ({
      ...prev,
      [serviceId]: userId,
    }))
  }

  async function handlesubmit(e) {
    e.preventDefault()

    if (!date || !client || servicesSelected.length === 0 || !hour) {
      toast.error("Completa todos los campos obligatorios antes de continuar")
      return
    }

    const servicesQuery = servicesSelected.map((serviceId) => ({
      serviceId,
      userId: serviceUsers[serviceId] || profesional,
    }))

    const appointmentData = {
      date: new Date(date).toJSON().split("T")[0],
      businessClientId: client,
      services: servicesQuery,
      businessId: business.id,
      user: user.id,
      startTime: hour,
    }

    if (mode === "edit") {
      appointmentData.status = status
      if (appointment?.id) {
        appointmentData.appointmentId = appointment.id
      }
    }

    const headers = {
      Authorization: token,
    }

    try {
      setLoading(true)
      const request =
        mode === "edit" && appointment?.id
          ? 
          axios.put(`${process.env.NEXT_PUBLIC_API_URL}/appointment/update`, appointmentData, {
              headers,
            })
          : 
          axios.post(`${process.env.NEXT_PUBLIC_API_URL}/appointment/create`, appointmentData, {
              headers,
            })

      const { data } = await request
      
      toast.success(data?.msg || (mode === "edit" ? "Cita actualizada exitosamente" : "Cita creada exitosamente"))

      if (mode !== "edit") {
        setAppointments((prev) => [...prev, data.appointment])
      }else{
        getAppointment()
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.msg || (mode === "edit" ? "Error al actualizar la cita" : "Error al crear la cita"))
    } finally {
        closeDrawer()
        setLoading(false)
        if (mode !== "edit") {
          setClient(undefined)
          setDate(undefined)
          setProfesional(undefined)
          setHour(undefined)
          setServicesSelected([])
          setServiceUsers({})
        }
    }
  }

  const selectedClient = client || appointment?.businessClientId || appointment?.businessClient?.id
  const selectedProfessional = profesional || appointment?.services?.[0]?.user?.id || appointment?.services?.[0]?.userId

  const servicesMap = useMemo(() => {
    return Object.fromEntries(
      services.map(service => [service.id, service])
    )
  }, [services])

  useEffect(() => {
    async function getAvailableUsers(services) {
      const headers = {
        Authorization: token,
      }
      const usersData = {
          services,
          startTime: hour,
          date: new Date(date).toJSON().split("T")[0],
          businessId: business.id
      }
      try {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/appointment/availability/users`, usersData, {
              headers,
            }
        )
        const usersByService = data.reduce((acc, item) => {
          if (item?.serviceId) {
            acc[item.serviceId] = item.availableUsers ?? []
          }
          return acc
        }, {})
        setAvailableUsers(usersByService)
      } catch (error) {
        console.error(error)
        toast.error(error?.response?.data?.msg || ("Error al cargar los usuarios disponibles"))
      }
    }

    if(servicesSelected.length !== 0 && hour){
      const services = servicesSelected.map(serviceId => (
        {
          serviceId
        }
      ))
      getAvailableUsers(services)
    }
  }, [servicesSelected, hour, date])

  return (
    <form className={cn("grid items-start gap-6")} onSubmit={handlesubmit}>
      <div className="grid gap-3">
        <Label htmlFor="cliente">Cliente</Label>
        <Select
          name="cliente"
          id="cliente"
          value={selectedClient}
          onValueChange={(value) => setClient(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients?.map((clientItem) => (
              <SelectItem key={clientItem.id} value={clientItem.id}>
                {clientItem?.client?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="fecha">Fecha</Label>
        <DateTimePicker date={date} setDate={setDate} />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="servicio">Servicios</Label>
        <ServiceCard services={services} servicesSelected={servicesSelected} setServicesSelected={setServicesSelected} />
      </div>

      {mode === "edit" && (
        <div className="grid gap-3">
          <Label htmlFor="status">Estado</Label>
          <Select name="status" id="status" value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SCHEDULED">Agendada</SelectItem>
              <SelectItem value="CONFIRMED">Confirmada</SelectItem>
              <SelectItem value="COMPLETED">Completada</SelectItem>
              <SelectItem value="CANCELED">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

              
      {!date || servicesSelected.length === 0 ? null : (
        <>

          <div className="grid gap-3">
            <Label htmlFor="hora">Horarios disponibles:</Label>
            <Schedule date={date} servicesSelected={servicesSelected} setHour={setHour} hour={hour} userId={profesional} appointmentId={appointment?.id} />
          </div>

          
          {servicesSelected.length > 0 && (
            
            <div className="space-y-4">
              {servicesSelected.map((serviceId) => {
                const service = servicesMap[serviceId]

                return (
                  <div key={serviceId} className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                    <Label>{service?.name}</Label>

                    <Select
                      value={serviceUsers[serviceId] || selectedProfessional}
                      onValueChange={(value) => updateServiceUser(serviceId, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>

                      <SelectContent>
                        {availableUsers[serviceId]?.map((user) => (
                          <SelectItem
                            key={`${serviceId}-${user.id}`}
                            value={user.id}
                          >
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
          )}

          {!client || !date || servicesSelected.length === 0 || !hour ? (
            (
            <Button className="cursor-pointer" type="submit" disabled={true}>
              {label}
            </Button>
          )
          ) : (
            <Button className="cursor-pointer" type="submit" disabled={loading}>
              {label}
            </Button>
          )}
        </>
      )}
    </form>
  )
}
