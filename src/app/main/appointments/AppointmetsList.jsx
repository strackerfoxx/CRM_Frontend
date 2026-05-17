"use client"
import { useState, useEffect } from 'react'

import axios from 'axios'

import { useUser } from '@/hooks/useUser'
import { useService } from '@/hooks/useService'

import AppointmentFilterBar from '@/components/AppointmentFilterBar'
import AppointmentsList from '@/components/AppointmentsList' 
import Pagination from '@/components/Pagination'

export default function AppointmetsListAppointment() {
    const [appointments, setAppointments] = useState([])
    const [category, setCategory] = useState('')
    const [service, setService] = useState('')
    const [status, setStatus] = useState('all')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(null)
    const [totalResults, setTotalResults] = useState(null)
    const [loading, setLoading] = useState(true)
    const [date, setDate] = useState({
        from: new Date(new Date().setDate(new Date().getDate() - 7)),
        to: new Date(),
    })

    const { token } = useUser()
    const { services } = useService()

    async function onSubmit() {
        setLoading(true)
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/appointment/get-appointments-by-params?startDate=${new Date(date.from).toISOString().split('T')[0]}&endDate=${new Date(date.to).toISOString().split('T')[0]}${status !== 'all' ? `&status=${status}` : ''}${category ? `&category=${category}` : ''}${service ? `&service=${service}` : ''}${search ? `&search=${search}` : ''}&page=${page}&limit=20`,
                {
                    headers: {
                    Authorization: token,
                    },
                }
            );
            setAppointments(data?.appointments ?? [])
            setTotalPages(data?.totalPages ?? null)
            setTotalResults(data?.total ?? null)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        onSubmit()
    }, [page])

  return (
     <>
        <div className="flex items-center mt-5 mx-7 mb-5 md:mb-0">
            <div className="flex flex-1 justify-between">
                <h1 className="scroll-m-20 text-start text-4xl font-bold tracking-tight text-balance">Citas</h1>
                <span className="text-neutral-400 mx-7 mt-3">Total de citas: {totalResults}</span>
            </div>
            <button className="bg-blue-600 p-2 rounded-3xl font-semibold px-4 cursor-pointer">Crear cita</button>
        </div>
        
        <AppointmentFilterBar 
            category={category}
            setCategory={setCategory}
            service={service}
            setService={setService}
            status={status}
            setStatus={setStatus}
            search={search}
            setSearch={setSearch}
            date={date}
            setDate={setDate}
            services={services}

            onSubmit={onSubmit}
        />

        <AppointmentsList appointments={appointments} loading={loading} />

        <Pagination 
            page={page}
            setPage={setPage}
            totalPages={totalPages}
        />

    </>
  )
}
