"use client"
import api from "@/lib/api";
import { useState, useEffect } from "react";

import { useUser } from "@/hooks/useUser";
import { useTeam } from "@/hooks/useTeam";
import { useParams } from "next/navigation";
import ServiceComponent from "@/components/ServiceComponent";

export default function CreateService({ params }) {
  const { id } = useParams();
  const { team } = useTeam()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState(0)
  const [durationHours, setDurationHours] = useState(0)
  const [durationMinutes, setDurationMinutes] = useState(0)
  const [description, setDescription] = useState("")
  const [cleaningTimeMin, setCleaningTimeMin] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [selectedStaff, setSelectedStaff] = useState([])

  return (
    <>
        <ServiceComponent 
          team={team}
          id={id}
          editMode={Boolean(id)}
          name={name}
          setName={setName}
          category={category}
          setCategory={setCategory}
          price={price}
          setPrice={setPrice}
          durationHours={durationHours}
          setDurationHours={setDurationHours}
          durationMinutes={durationMinutes}
          setDurationMinutes={setDurationMinutes}
          description={description}
          setDescription={setDescription}
          cleaningTimeMin={cleaningTimeMin}
          setCleaningTimeMin={setCleaningTimeMin}
          isActive={isActive}
          setIsActive={setIsActive}
          selectedStaff={selectedStaff}
          setSelectedStaff={setSelectedStaff}
        />
    </>
  )
}
