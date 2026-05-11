import { DrawerDialog } from "@/components/ui/DrawerDialog"
import CreateAppointmentForm from "./CreateAppointmentForm"
import { Toaster } from "sonner"

export default function Drawer({
  title,
  description,
  label,
  appointment,
  mode,
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
}) {
  return (
    <div>
      <Toaster position="top-center" richColors />
      <DrawerDialog title={title} description={description}>
        <CreateAppointmentForm
          label={label}
          mode={mode}
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
      </DrawerDialog>
    </div>
  )
}
