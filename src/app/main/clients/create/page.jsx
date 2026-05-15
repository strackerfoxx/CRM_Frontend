"use client"
import { useState } from "react";
import ClientComponent from "@/components/ClientComponent";

export default function CreateClient() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  return (
    <ClientComponent
      editMode={false}
      name={name}
      setName={setName}
      phone={phone}
      setPhone={setPhone}
      email={email}
      setEmail={setEmail}
    />
  )
}
