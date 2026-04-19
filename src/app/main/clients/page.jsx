"use client"
import { useState, useEffect } from "react";
import { useClient } from "@/hooks/useClients"
import Link from "next/link";
import "@/css/list.css"

export default function Clients() {
    const { clients } = useClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredClients, setFilteredClients] = useState(clients);

    useEffect(() => {
        if (clients.length === 0) return setFilteredClients([]);

        const sortedClients = [...clients].sort((a, b) => {
            return new Date(b.client.createdAt) - new Date(a.client.createdAt);
        });

        if (searchTerm === "") return setFilteredClients(sortedClients);

        const filtered = sortedClients.filter(c => {
            return c.client?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                   c.client?.phone?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                   c.client?.email?.toLowerCase()?.includes(searchTerm.toLowerCase());
        });
        setFilteredClients(filtered);
    }, [searchTerm, clients])
  return (
    <>
        <div className="flex justify-between items-center mt-5 mx-7">
            <div className="flex">
                <h1 className="scroll-m-20 text-start text-4xl font-bold tracking-tight text-balance" >Clientes</h1>
                <span className="text-neutral-400 mx-7 mt-3">Total de clientes: {clients.length}</span>
            </div>
            <button className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear cliente</button>
        </div>
        <div className="m-7 flex text-center items-center gap-3 px-3 bg-neutral-800 rounded-lg border border-neutral-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input type="text" name="client" id="client" onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar clientes por nombre, telefono o correo..." className="w-full p-2" />
        </div>
        <div className="m-5">
            <div className="bg-neutral-900 rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="grid grid-cols-4 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                    <span>Nombre</span>
                    <span>Telefono</span>
                    <span>Email</span>
                    <span>Creado</span>
                </div>

                {filteredClients.map((c) => (
                    <Link href={`/main/clients/${c.id}`} key={c.id} 
                        className="grid grid-cols-4 item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                    > 
                        <div className="col-name overflow-hidden">{c.client.name}</div>
                        <div className="col-phone overflow-hidden">{c.client.phone}</div>
                        <div className="col-email overflow-hidden">{c.client.email}</div>
                        <div className="col-created overflow-hidden">{c.client.createdAt.split("T")[0]}</div>
                    </Link>
                )) }
            </div>
        </div>
    </>
  )
}
