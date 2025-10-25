"use client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OverviewHeader() {
  const router = useRouter()
  return (
      <header className="flex h-16 items-center justify-between border-b border-neutral-800 px-6">
        <div className="flex items-center gap-4">
        <button onClick={() => { router.back() }} className="cursor-pointer">
          <ArrowLeft className="mt-1" size={27}/>
        </button>
        <h1 className="text-xl font-bold">Volver</h1>
        </div>
      </header>
  )
}
