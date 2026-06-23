"use client"
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";

import ProfessionalComponent from "@/components/ProfessionalComponent";

export default function EditProfessional() {
  const { id } = useParams();
  const { token, isLoaded } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); // Not used much in edit but needed for component
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if(!isLoaded) return;
    if(!id) return;

    const fetchProfessional = async () => {
        try {
            const { data } = await api.get(
                `/user/get-user-by-id?id=${id}`,
                {
                  headers: {
                    Authorization: token,
                  },
                }
            );

            if (data) {
                setName(data.name || "");
                setEmail(data.email || "");
                setRole(data.role || "");
                setPhone(data.phone || "");
            }

            const schedulesRes = await api.get(
                `/user/schedule?userId=${id}`,
                {
                  headers: {
                    Authorization: token,
                  },
                }
            )
            if (schedulesRes.data) {
                setSchedules(schedulesRes.data);
            }

        } catch (error) {
            console.error("Failed to fetch professional for edit:", error);
        }
    }

    fetchProfessional();
  }, [id, token, isLoaded]);

  return (
    <>
        <ProfessionalComponent
          id={id}
          editMode={true}
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
          schedules={schedules}
          setSchedules={setSchedules}
        />
    </>
  )
}
