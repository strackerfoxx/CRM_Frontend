import React, { Children } from 'react'
import { statusOptions } from './AppointmentFilterBar'
import { DatePickerWithRange } from './DateTimePickerRange'

export default function SearchBarComponent({ search, setSearch, onSubmit, children }) {
  return (
    <>
        <div className='m-5 p-5 bg-neutral-900 rounded-2xl '>

            {/* Search and Date Range */}
            <div className='md:flex flex-1 gap-5 md:flex-row flex-col items-center justify-between mb-5'>
                <div className="flex text-center items-center gap-2 px-3 bg-black rounded-lg border border-neutral-800 text-white w-full mb-5 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <input
                      type="text"
                      name="client"
                      id="client"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar clientes por nombre, telefono o correo..."
                      className="w-full p-2"
                    />
                </div>
                <div className='md:flex justify-between gap-3 items-center'>
                    <button type="button" onClick={onSubmit} className="bg-blue-600 p-2 rounded-lg font-semibold px-4 cursor-pointer w-full md:w-48 mt-5 md:mt-0 hidden lg:block">Buscar</button>
                </div>
            </div>

            {children}

            <button type="button" onClick={onSubmit} className="bg-blue-600 p-2 rounded-lg font-semibold px-4 cursor-pointer w-full md:w-48 mt-5 hidden md:block lg:hidden mb-5">Buscar</button>

            <button type="button" onClick={onSubmit} className="bg-blue-600 p-2 rounded-lg font-semibold px-4 cursor-pointer w-full md:w-48  mt-5 md:mt-0 md:hidden">Buscar</button>
        </div>
    </>
  )
}
