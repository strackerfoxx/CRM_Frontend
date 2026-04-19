import ClientDetailsClient from "./ClientDetailsClient"

export default function Client({ params }) {
  return <ClientDetailsClient id={params.id} />
}
