"use client"
import { useState, useEffect } from "react";
import api from "@/lib/api";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBarComponent from "@/components/SearchBarComponent";
import Pagination from "@/components/Pagination";

import { useUser } from "@/hooks/useUser";
import { useProfessionals } from "@/hooks/useProfessionals";
import { useService } from "@/hooks/useService";
import "@/css/list.css"
import { DeleteModal } from "@/components/modals/DeleteModal";
import { toast, Toaster } from "sonner";

export default function ServicesList() {
    const { services, refetchServices } = useService();
    const [searchTerm, setSearchTerm] = useState("");

    const { token } = useUser();
    const { professionals } = useProfessionals();

    const [filteredServices, setFilteredServices] = useState(services);
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [userId, setUserId] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const getServices = async () => {
        setLoading(true); 
        try {
            const { data } = await api.get(
                `/service/get-services-by-params?page=${page}&limit=20${searchTerm ? `&search=${searchTerm}` : ""}${userId ? `&userId=${userId}` : ""}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            setTotalPages(Math.ceil(data.total / 20));
            setTotalResults(data?.total ?? 0);
            setFilteredServices(data.services);
        } catch (error) {
            console.error(error);
            setFilteredServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getServices();
    }, [page]);

    const handleDelete = async (deleteId) => {
        try {
            await api.delete(`/service/delete-service`, {
                data: { id: deleteId },
                headers: {
                    Authorization: token,
                },
            });
            toast.success("El servicio se eliminó correctamente");
            getServices();
        } catch (error) {
            console.error("Error al eliminar servicio:", error);
            toast.error("Error al eliminar el servicio");
        }
    }

  return (
    <>
        <Toaster position="top-center" richColors />
        <div className="block sm:flex justify-between items-center mt-5 mx-7">
            <div className="block sm:flex">
                <h1 className="scroll-m-20 text-start text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-balance">Servicios</h1>
                <span className="block text-neutral-400 sm:mx-7 mt-3 mb-4 sm:mb-0">Total de servicios: {totalResults}</span>
            </div>
            <Link href="/main/services/create" className="block sm:inline-block w-full sm:w-auto text-center bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear servicio</Link>
            {/* <button onClick={() => refetchServices()} className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear servicio</button> */}
        </div>
        <SearchBarComponent
            search={searchTerm}
            setSearch={setSearchTerm}
            onSubmit={getServices}
            placeholder="Buscar servicios por nombre, precio o duración..."
        >
            <div className='flex justify-between gap-2 items-center bg-background text-foreground p-2 rounded-lg border border-border w-[220px] mr-1 mb-4 md:mb-0 h-10'>
                <span className='text-gray-600 font-semibold'>Profesional</span>
                <select
                    name="userId"
                    id="userId"
                    value={userId}
                    onChange={e => setUserId(e.target.value)}
                    className="bg-background text-foreground items-center w-full text-center"
                >
                    <option value="">Selecciona el profesional</option>
                    {professionals.map((professional) => (
                        <option key={professional.id} value={professional.id}>
                            {professional.name}
                        </option>
                    ))}
                </select>
            </div>
        </SearchBarComponent>
        <div className="m-5">
            <div className="bg-card rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="hidden sm:grid list-grid-actions text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                    <span>Nombre</span>
                    <span>Precio</span>
                    <span>Duración</span>
                </div>

                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-4 item px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl">
                            <Skeleton className="h-6 w-32 bg-neutral-700" />
                            <Skeleton className="h-6 w-24 bg-neutral-700" />
                            <Skeleton className="h-6 w-40 bg-neutral-700" />
                            <Skeleton className="h-6 w-24 bg-neutral-700" />
                        </div>
                    ))
                ) : (
                    <>
                        {filteredServices?.map((s) => (
                            <Link href={`/main/services/${s.id}`} key={s.id} 
                                className="list-grid-actions item hover:bg-accent hover:text-accent-foreground px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                            > 
                                <div className="col-name overflow-hidden truncate text-lg">{s.name}</div>
                                <div className="col-price overflow-hidden truncate">${s.price.toFixed(2)}</div>
                                <div className="col-duration overflow-hidden truncate">{s.durationMin} minutos</div>
                                <div className="col-actions overflow-hidden flex gap-3 items-center bg-neutral-700 rounded-lg p-1 justify-center w-9">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); router.push(`/main/services/edit/${s.id}`)}}>
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                                                <DeleteModal
                                                    title="¿Eliminar servicio?"
                                                    description="Esta acción es permanente e irreversible. ¿Estás seguro de que quieres eliminar este servicio?"
                                                    onDelete={() => handleDelete(s.id)}
                                                    triggerLabel="Eliminar"
                                                />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </Link>
                        )) }
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
