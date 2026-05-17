"use client"
import { useState } from "react";
import ProfessionalComponent from "@/components/ProfessionalComponent";
import { useBusiness } from "@/hooks/useBusiness";

export default function CreateProfessional() {
  const { business } = useBusiness();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // En creación no le pasamos schedules ya que el endpoint /create crea los del business por defecto
  // y solo se actualizan en edición
  const [schedules, setSchedules] = useState([]);

  return (
    <>
        <ProfessionalComponent
          editMode={false}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          role={role}
          setRole={setRole}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          businessId={business?.id}
          schedules={schedules}
          setSchedules={setSchedules}
        />
    </>
  )
}
