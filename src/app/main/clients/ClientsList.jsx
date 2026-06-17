"use client"
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useUser } from "@/hooks/useUser"
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
import SearchBarComponent from "@/components/SearchBarComponent";
import "@/css/list.css"

export default function ClientsList() {
    const { token } = useUser();
    const [clientsList, setClientsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

    const getClients = async () => {
        setLoading(true); 
        try {
            const { data } = await api.get(
                `${process.env.NEXT_PUBLIC_API_URL}/client/get-client-by-params?page=${page}&limit=20${searchTerm ? `&search=${searchTerm}` : ""}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setClientsList(data?.clients ?? []);
            setTotalPages(data?.totalPages ?? null);
            setTotalResults(data?.total ?? 0);
        } catch (error) {
            console.error(error);
            setClientsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getClients();
    }, [page]);

  return (
    <>
        <div className="block sm:flex justify-between items-center mt-5 mx-7">
            <div className="block sm:flex">
                <h1 className="scroll-m-20 text-start text-4xl font-bold tracking-tight text-balance" >Clientes</h1>
                <span className="block text-neutral-400 sm:mx-7 mt-3 mb-4 sm:mb-0">Total de clientes: {totalResults}</span>
            </div>
            <Link href="/main/clients/create" className="block sm:inline-block w-full sm:w-auto text-center bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear cliente</Link>
        </div>
        {/* <div className="m-7 flex text-center items-center gap-3 px-3 bg-neutral-800 rounded-lg border border-neutral-700 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input type="text" name="client" id="client" onChange={handleSearchChange} value={searchTerm}
            placeholder="Buscar clientes por nombre, telefono o correo..." className="w-full p-2" />
        </div> */}
        <SearchBarComponent
            search={searchTerm}
            setSearch={setSearchTerm}
            onSubmit={getClients}
            placeholder="Buscar clientes por nombre, telefono o correo..."
        />
        <div className="m-5">
            <div className="bg-neutral-900 rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="hidden md:grid grid-cols-4 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                    <span>Nombre</span>
                    <span>Telefono</span>
                    <span>Email</span>
                    <span>Creado</span>
                </div>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-4 item px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl">
                            <Skeleton className="h-6 w-32 bg-neutral-700" />
                            <Skeleton className="h-6 w-24 bg-neutral-700" />
                            <Skeleton className="h-6 w-40 bg-neutral-700" />
                            <Skeleton className="h-6 w-24 bg-neutral-700" />
                        </div>
                    ))
                ) : (
                    <>
                        {clientsList.map((c) => (
                            <Link href={`/main/clients/${c.id}`} key={c.id}
                                className="grid grid-cols-1 md:grid-cols-4 item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                            >
                                <div className="col-name overflow-hidden truncate">{c.client?.name}</div>
                                <div className="col-phone overflow-hidden truncate">{c.client?.phone}</div>
                                <div className="col-email overflow-hidden truncate">{c.client?.email}</div>
                                <div className="col-created overflow-hidden truncate">{c.client?.createdAt?.split("T")[0]}</div>
                            </Link>
                        ))}
                        {clientsList.length === 0 && (
                            <div className="text-center text-neutral-500 py-10">
                                No hay clientes para mostrar
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

        <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
        />
    </>
  )
}
