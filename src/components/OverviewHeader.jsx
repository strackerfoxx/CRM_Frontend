"use client"
import {   
  Edit,
  Share2,
  ArrowLeft 
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function OverviewHeader() {
  const router = useRouter()
  return (
      <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-2xl flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 mb-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => { router.back() }}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center active:scale-95 transition cursor-pointer">
          <span className="text-lg sm:text-xl font-bold text-foreground flex items-center ml-10 gap-5">
            <ArrowLeft className="text-foreground w-5 h-5 sm:w-6 sm:h-6" />
            Volver
          </span>
          </button>
        </div>
      </header>
  )
}
