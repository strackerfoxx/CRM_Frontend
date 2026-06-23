"use client"
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import ClientComponent from "@/components/ClientComponent";

export default function EditClient() {
  const { id } = useParams();
  const { token, isLoaded } = useUser()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(!isLoaded) return;
    if(!id) return;

    const getClient = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get(
          `/client/get-client-by-id?id=${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (data?.client?.client) {
            setName(data.client.client.name ?? "")
            setPhone(data.client.client.phone ?? "")
            setEmail(data.client.client.email ?? "")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    getClient()
  }, [id, token, isLoaded])

  return (
    <ClientComponent
      isLoading={isLoading}
      id={id}
      editMode={true}
      name={name}
      setName={setName}
      phone={phone}
      setPhone={setPhone}
      email={email}
      setEmail={setEmail}
    />
  )
}
