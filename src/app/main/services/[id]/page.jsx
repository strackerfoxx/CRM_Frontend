import ServiceDetailsClient from "./ServiceDetailsClient";

export default function Service({params}) {
  return (
    <ServiceDetailsClient id={params.id} />
  )
}
