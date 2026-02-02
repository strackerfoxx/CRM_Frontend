import AppointmentDetailsClient from "./AppointmentDetailsClient";

export default function Appointment({ params }) {
  return <AppointmentDetailsClient id={params.id} />;
}