"use client"
import api from "@/lib/api";
import { useState, useEffect } from "react";

import { useUser } from "@/hooks/useUser";
import { useTeam } from "@/hooks/useTeam";
import { useParams } from "next/navigation";
import ServiceComponent from "@/components/ServiceComponent";

export default function EditService({ params }) {
  const { id } = useParams();

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState(0)
  const [durationHours, setDurationHours] = useState(0)
  const [durationMinutes, setDurationMinutes] = useState(0)
  const [description, setDescription] = useState("")
  const [cleaningTimeMin, setCleaningTimeMin] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [selectedStaff, setSelectedStaff] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [service, setService] = useState({})

  const { token, isLoaded } = useUser()

    useEffect(() => {
      if(!isLoaded) return;
      if(!id) return;
      
      const getService = async () => {
        setIsLoading(true)
        try {
          const { data } = await api.get(
            `/service/get-service-by-id?id=${id}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );

          setService(data?.service)
          setName(data?.service?.name ?? "")
          setCategory(data?.service?.category ?? "")
          setPrice(data?.service?.price ?? 0)
          const durationTotal = Number(data?.service?.durationMin ?? 0)
          setDurationHours(Math.floor(durationTotal / 60))
          setDurationMinutes(durationTotal % 60)
          setDescription(data?.service?.description ?? "")
          setCleaningTimeMin(data?.service?.cleaningTimeMin ?? 0)
          setIsActive(data?.service?.isActive ?? true)
          setSelectedStaff(
            data?.service?.users?.map((user) => ({ name: user.user?.name ?? user.name, id: user.user?.id ?? user.id })) ?? []
          )

        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }

      
      getService()
    }, [id, token, isLoaded])
    
  return (
    <>
        <ServiceComponent 
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
