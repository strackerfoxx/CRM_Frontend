"use client"
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
import SearchBarComponent from "@/components/SearchBarComponent";

import { useUser } from "@/hooks/useUser";
import "@/css/list.css"

export default function UsersListUsers() {
    const { token } = useUser()

    const [searchTerm, setSearchTerm] = useState("");
    const [role, setRole] = useState(undefined);
    const [filteredProfessionals, setFilteredProfessionals] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

    const getUsers = async () => {
        setLoading(true);

        try {
            const {data} = await api(`${process.env.NEXT_PUBLIC_API_URL}/user/get-users-by-params?page=${page}&limit=20${searchTerm ? `&search=${searchTerm}` : ""}${role ? `&role=${role}` : ""}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setTotalResults(data.total)
            setFilteredProfessionals(data.users)
            setTotalPages(Math.ceil(data.total / 20));
        } catch (error) {
             console.error(error)
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        getUsers();
    }, [page]);

  return (
    <>
        <div className="block sm:flex justify-between items-center mt-5 mx-7">
            <div className="block sm:flex">
                <h1 className="scroll-m-20 text-start text-4xl font-bold tracking-tight text-balance" >Profesionales</h1>
                <span className="block text-neutral-400 sm:mx-7 mt-3 mb-4 sm:mb-0">Total de profesionales: {totalResults}</span>
            </div>
            <Link href="/main/profesionals/create" className="block sm:inline-block w-full sm:w-auto text-center bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear Profesional</Link>
        </div>
        <SearchBarComponent
            search={searchTerm}
            setSearch={setSearchTerm}
            onSubmit={getUsers}
            placeholder="Buscar profesionales por nombre, rol o correo..."
        >
            <div className='flex justify-between gap-2 items-center bg-black text-white p-2 rounded-lg border border-neutral-800 w-[220px] mr-1 mb-4 md:mb-0 h-10'>
                <span className='text-gray-600 font-semibold'>Rol</span>
                <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="bg-black text-white items-center w-full text-center"
                >
                    
                    <option value="">Selecciona el rol</option>
                    <option value="EMPLOYEE">Empleado</option>
                    <option value="ADMIN">Administrador</option>
                </select>
            </div>
        </SearchBarComponent>
        <div className="m-5">
            <div className="bg-neutral-900 rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="hidden md:grid grid-cols-4 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                    <span>Nombre</span>
                    <span>Rol</span>
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
                        {filteredProfessionals.map((p) => (
                            <Link href={`/main/profesionals/${p.id}`} key={p.id}
                                className="grid grid-cols-1 md:grid-cols-4 item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                            >
                                <div className="col-name overflow-hidden truncate">{p.name}</div>
                                <div className="col-phone overflow-hidden truncate">{p.role}</div>
                                <div className="col-email overflow-hidden truncate">{p.email}</div>
                                <div className="col-created overflow-hidden truncate">{p.createdAt?.split("T")[0]}</div>
                            </Link>
                        ))}
                        {filteredProfessionals.length === 0 && (
                            <div className="text-center text-neutral-500 py-10">
                                No hay profesionales para mostrar
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