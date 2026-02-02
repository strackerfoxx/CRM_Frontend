import { DrawerDialog } from "@/components/ui/DrawerDialog"
import CreateAppointmentForm from "./CreateAppointmentForm"

export default function Drawer({title, description, label}) {
  return (
    <div>
        <DrawerDialog title={title} description={description}  >
            <CreateAppointmentForm label={label} />
        </DrawerDialog>
    </div>
  )
}
