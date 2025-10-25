import { useContext } from "react";
import AppointmentContext from "@/app/context/AppointmentProvider";


export function useAppointment() {
  return useContext(AppointmentContext)
}
