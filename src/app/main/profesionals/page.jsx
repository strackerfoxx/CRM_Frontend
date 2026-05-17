"use client"
import { useState, useEffect } from "react";
import { useProfessionals } from "@/hooks/useProfessionals";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
import SearchBarComponent from "@/components/SearchBarComponent";
import "@/css/list.css"

export default function Profesionals() {
    const { professionals } = useProfessionals();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProfessionals, setFilteredProfessionals] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchProfessionals = async () => {
        setLoading(true);

        // Artificial delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));

        let currentProfessionals = [...professionals];

        if (searchTerm !== "") {
            currentProfessionals = currentProfessionals.filter(u => {
                return u?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                        u?.phone?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                        u?.email?.toLowerCase()?.includes(searchTerm.toLowerCase());
            });
        }

        const sortedProfessionals = currentProfessionals.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const limit = 20;
        const total = sortedProfessionals.length;
        const totalPagesCalculated = Math.ceil(total / limit);

        // Basic pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProfessionals = sortedProfessionals.slice(startIndex, endIndex);

        setTotalResults(total);
        setTotalPages(totalPagesCalculated);
        setFilteredProfessionals(paginatedProfessionals);
        setLoading(false);
        setPage(1);
    };

    useEffect(() => {
        fetchProfessionals();
    }, [page, professionals]);

  return (
    <>
        <div className="flex justify-between items-center mt-5 mx-7">
            <div className="flex">
                <h1 className="scroll-m-20 text-start text-4xl font-bold tracking-tight text-balance" >Profesionales</h1>
                <span className="text-neutral-400 mx-7 mt-3">Total de profesionales: {totalResults}</span>
            </div>
            <Link href="/main/profesionals/create" className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear Profesional</Link>
        </div>
        <SearchBarComponent search={searchTerm} setSearch={setSearchTerm} onSubmit={fetchProfessionals}/>
        <div className="m-5">
            <div className="bg-neutral-900 rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="grid grid-cols-4 header text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                    <span>Nombre</span>
                    <span>Rol</span>
                    <span>Email</span>
                    <span>Creado</span>
                </div>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-4 item px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl">
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
                                className="grid grid-cols-4 item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                            >
                                <div className="col-name overflow-hidden">{p.name}</div>
                                <div className="col-phone overflow-hidden">{p.role}</div>
                                <div className="col-email overflow-hidden">{p.email}</div>
                                <div className="col-created overflow-hidden">{p.createdAt?.split("T")[0]}</div>
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
