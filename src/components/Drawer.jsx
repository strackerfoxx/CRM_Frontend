import { DrawerDialog } from "@/components/ui/DrawerDialog"
import CreateAppointmentForm from "./CreateAppointmentForm"
import { Toaster } from "sonner"

export default function Drawer({title, description, label}) {
  return (
    <div>
        <Toaster position="top-center" richColors />
        <DrawerDialog title={title} description={description}  >
            <CreateAppointmentForm label={label} />
        </DrawerDialog>
    </div>
  )
}
