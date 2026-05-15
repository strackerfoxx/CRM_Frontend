"use client"
import { useState, useEffect } from "react";
import { useProfessionals } from "@/hooks/useProfessionals";
import Link from "next/link";
import "@/css/list.css"

export default function Profesionals() {
    const [searchTerm, setSearchTerm] = useState("");
    const { professionals } = useProfessionals()
    const [filteredProfessionals, setFilteredProfessionals] = useState(professionals)

    useEffect(() => {
        if (professionals.length === 0) return setFilteredProfessionals([]);

        const sortedProfesionals = [...professionals].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (searchTerm === "") return setFilteredProfessionals(sortedProfesionals);


        const sortedProfesional = [...professionals].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (searchTerm === "") return setFilteredProfessionals(sortedProfesional);

        const filtered = sortedProfesionals.filter(u => {
            return u?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                   u?.phone?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                   u?.email?.toLowerCase()?.includes(searchTerm.toLowerCase());
        });
        setFilteredProfessionals(filtered);
    }, [searchTerm, professionals])
    console.log(filteredProfessionals)
    // console.log("professionals", professionals)
  return (
    <>
        <div className="flex justify-between items-center mt-5 mx-7">
            <div className="flex">
                <h1 className="scroll-m-20 text-start text-4xl font-bold tracking-tight text-balance" >Profesionales</h1>
                {/* <span className="text-neutral-400 mx-7 mt-3">Total de profesionales: {profesionals.length}</span> */}
            </div>
            <button className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear Profesional</button>
        </div>
        <div className="m-7 flex text-center items-center gap-3 px-3 bg-neutral-800 rounded-lg border border-neutral-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input type="text" name="user" id="user" onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar profesionales por nombre, telefono o correo..." className="w-full p-2" />
        </div>
        <div className="m-5">
            <div className="bg-neutral-900 rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="grid grid-cols-4 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                    <span>Nombre</span>
                    <span>Rol</span>
                    <span>Email</span>
                    <span>Creado</span>
                </div>

                {filteredProfessionals.map((p) => (
                    <Link href={`/main/profesionals/${p.id}`} key={p.id} 
                        className="grid grid-cols-4 item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                    > 
                        <div className="col-name overflow-hidden">{p.name}</div>
                        <div className="col-phone overflow-hidden">{p.role}</div>
                        <div className="col-email overflow-hidden">{p.email}</div>
                        <div className="col-created overflow-hidden">{p.createdAt.split("T")[0]}</div>
                    </Link>
                )) }
            </div>
        </div>
    </>
  )
}
