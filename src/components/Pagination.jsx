"use client"

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ 
  page, 
  setPage, 
  totalPages = null,
  hasNextPage = true,
  hasPreviousPage = true,
  onPageChange = null 
}) {
  
  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1
      setPage(newPage)
      onPageChange?.(newPage)
    }
  }

  const handleNext = () => {
    if (!totalPages || page < totalPages) {
      const newPage = page + 1
      setPage(newPage)
      onPageChange?.(newPage)
    }
  }

  const canGoPrevious = page > 1 && hasPreviousPage
  const canGoNext = (!totalPages || page < totalPages) && hasNextPage

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          Página <span className="font-bold text-blue-600">{page}</span>
          {totalPages && <span> de {totalPages}</span>}
        </span>
      </div>

      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
