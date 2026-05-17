"use client"
import { useState, useEffect } from "react";
import { useService } from "@/hooks/useService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import "@/css/list.css"
import SearchBarComponent from "@/components/SearchBarComponent";
import Pagination from "@/components/Pagination";

export default function ServicesList() {
    const { services, refetchServices } = useService();
    const [searchTerm, setSearchTerm] = useState("");

    const [filteredServices, setFilteredServices] = useState(services);
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(true);

    const getServices = async () => {
        setLoading(true); 
        try {
            const { data } = await axios.get(
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
        getServices();
    }, [page]);

  return (
    <>
        <div className="sm:flex justify-between items-center mt-5 mx-7">
            <div className="flex">
                <h1 className="scroll-m-20 text-start text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-balance" >Servicios</h1>
                <span className="text-neutral-400 mx-7 mt-3">Total de servicios: {services.length}</span>
            </div>
            <Link href="/main/services/create" className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear servicio</Link>
            {/* <button onClick={() => refetchServices()} className="bg-blue-600 p-2 rounded-3xl font-semibold px-4">Crear servicio</button> */}
        </div>
        <SearchBarComponent search={searchTerm} setSearch={setSearchTerm} onSubmit={getServices}/>
        <div className="m-5">
            <div className="bg-neutral-900 rounded-2xl font-semibold">
                {/* Header row using same grid as items */}
                <div className="list-grid-actions text-neutral-400 font-semibold mb-2 border-b pb-2 p-5">
                    <span>Nombre</span>
                    <span>Precio</span>
                    <span>Duración</span>
                </div>

                {filteredServices.map((s) => (
                    <Link href={`/main/services/${s.id}`} key={s.id} 
                        className="list-grid-actions item hover:bg-neutral-800 px-6 gap-5 py-4 mb-2 border-b border-b-neutral-700 rounded-b-2xl"
                    > 
                        <div className="col-name overflow-hidden text-lg">{s.name}</div>
                        <div className="col-price overflow-hidden">${s.price.toFixed(2)}</div>
                        <div className="col-duration overflow-hidden">{s.durationMin} minutos</div>
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
                                    <DropdownMenuItem onClick={(e) => {e.stopPropagation(); console.log("Eliminar servicio", s.id)}}>
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Link>
                )) }
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
