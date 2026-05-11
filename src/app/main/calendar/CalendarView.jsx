"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Function to format minutes to Xh Ym
function formatMinutes(minutes) {
  if (!minutes) return "0h 0m"
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState(null)
  const [dayMetrics, setDayMetrics] = useState(null)
  const [dayLoading, setDayLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchMonthMetrics(currentMonth)
  }, [currentMonth])

  const fetchMonthMetrics = async (date) => {
    setLoading(true)
    try {
      const startDate = format(startOfMonth(date), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(date), 'yyyy-MM-dd')

      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/appointment/calendar-metrics`, {
        params: { startDate, endDate }
      })

      setMetrics(response.data)
    } catch (error) {
      console.error("Error fetching calendar metrics:", error)
      // Mock data for development if endpoint fails
      setMetrics({
        totalAppointments: 10,
        dailyMetrics: [
          { date: "2026-05-06", count: 1, color: "blue" },
          { date: "2026-05-09", count: 1, color: "blue" },
          { date: "2026-05-13", count: 3, color: "blue" },
          { date: "2026-05-14", count: 2, color: "blue" },
          { date: "2026-05-15", count: 1, color: "blue" },
          { date: "2026-05-16", count: 2, color: "blue" }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchDayMetrics = async (date) => {
    setDayLoading(true)
    try {
      const formattedDate = format(date, 'yyyy-MM-dd')
      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/appointment/day-metrics`, {
        params: { date: formattedDate }
      })
      setDayMetrics(response.data)
    } catch (error) {
      console.error("Error fetching day metrics:", error)
      // Mock data for development if endpoint fails
      setDayMetrics({
        appointments: [
          { startTime: "09:00", endTime: "10:05", status: "SCHEDULED", clientName: "Diego Castle", employeeName: "Marcos - Manicurista" },
          { startTime: "09:20", endTime: "12:10", status: "CONFIRMED", clientName: "Alex Edu", employeeName: "Ana" },
          { startTime: "10:20", endTime: "11:20", status: "COMPLETED", clientName: "Sotodiego", employeeName: "Marcos - Manicurista" }
        ],
        revenue: 4908,
        employeeOccupancy: { "Marcos - Manicurista": 120, "Ana": 150 },
        deadTime: 350
      })
    } finally {
      setDayLoading(false)
    }
  }

  const handleDayClick = (date) => {
    if (!date) return
    setSelectedDate(date)
    setIsModalOpen(true)
    fetchDayMetrics(date)
  }

  // Custom Day component to show appointment count
  const CustomDayButton = (props) => {
    const { day, modifiers, className } = props

    // Default day rendering for empty dates
    if (!day || !day.date) {
        return <button {...props} className={className}></button>
    }

    const dateStr = format(day.date, 'yyyy-MM-dd')
    const dayMetric = metrics?.dailyMetrics?.find(m => m.date === dateStr)

    // Base styles
    let baseClass = className + " relative h-14 w-full flex flex-col items-center justify-start pt-1"

    // Add background color if it has saturation
    if (dayMetric) {
      // Very basic color mapping based on standard tailwind colors or provided 'color'
      const colorMap = {
        'blue': 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-500',
        'green': 'bg-green-500/20 hover:bg-green-500/30 text-green-500',
        'red': 'bg-red-500/20 hover:bg-red-500/30 text-red-500',
        'yellow': 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500',
      }
      baseClass += " " + (colorMap[dayMetric.color] || 'bg-primary/20 text-primary')
    }

    return (
      <button
        {...props}
        className={baseClass}
        onClick={() => handleDayClick(day.date)}
      >
        <span className="text-sm font-medium">{day.date.getDate()}</span>
        {dayMetric && (
          <span className="text-[10px] mt-1 font-bold">
            {dayMetric.count} cita{dayMetric.count !== 1 ? 's' : ''}
          </span>
        )}
      </button>
    )
  }

  const getStatusBorderColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED': return 'border-blue-500'
      case 'CONFIRMED': return 'border-yellow-500'
      case 'COMPLETED': return 'border-green-500'
      case 'CANCELLED': return 'border-red-500'
      default: return 'border-gray-500'
    }
  }

  // Generate timeline slots (08:00 to 20:00)
  const generateTimeSlots = () => {
    const slots = []
    for (let i = 8; i <= 20; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`)
    }
    return slots
  }

  // Calculate top position and height based on startTime and endTime
  const calculatePosition = (startTime, endTime) => {
    const [startH, startM] = startTime.split(':').map(Number)
    const [endH, endM] = endTime.split(':').map(Number)

    // Assuming timeline starts at 08:00
    const startOffsetMinutes = (startH - 8) * 60 + startM
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM)

    // 1 minute = 1 pixel for easy math (60px per hour)
    return {
      top: `${startOffsetMinutes}px`,
      height: `${durationMinutes}px`
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calendario de Citas</h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-lg w-fit">
            <span className="text-lg font-medium">Total Citas del Mes:</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {metrics?.totalAppointments || 0}
            </Badge>
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDayClick}
            onMonthChange={setCurrentMonth}
            className="rounded-md border bg-card w-full max-w-4xl"
            classNames={{
              months: "w-full",
              month: "w-full space-y-4",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-full",
              day: "h-14 w-full p-0 font-normal aria-selected:opacity-100"
            }}
            components={{
              DayButton: CustomDayButton
            }}
          />
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Detalles del {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
            </DialogTitle>
          </DialogHeader>

          {dayLoading ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : dayMetrics ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Ingresos: ${dayMetrics.revenue}
                </Badge>
                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                  Tiempo Muerto: {formatMinutes(dayMetrics.deadTime)}
                </Badge>

                {Object.entries(dayMetrics.employeeOccupancy || {}).map(([emp, time]) => (
                  <Badge key={emp} variant="secondary">
                    {emp}: {formatMinutes(time)}
                  </Badge>
                ))}
              </div>

              <ScrollArea className="flex-1 pr-4">
                <div className="relative w-full min-h-[720px] mt-4">
                  {/* Background grid for time slots (08:00 to 20:00 = 12 hours * 60px = 720px) */}
                  {generateTimeSlots().map((time, i) => (
                    <div
                      key={time}
                      className="absolute w-full flex items-start border-t border-border/50 text-xs text-muted-foreground"
                      style={{ top: `${i * 60}px`, height: '60px' }}
                    >
                      <span className="w-12 -mt-2 pr-2 text-right bg-background">{time}</span>
                      <div className="flex-1 h-full border-l border-border/50 pl-2"></div>
                    </div>
                  ))}

                  {/* Appointments Blocks */}
                  <div className="absolute left-14 right-0 top-0 bottom-0">
                    {dayMetrics.appointments?.map((apt, i) => {
                      const pos = calculatePosition(apt.startTime, apt.endTime)
                      return (
                        <div
                          key={i}
                          className={`absolute w-full bg-card p-2 rounded-md border-l-4 shadow-sm overflow-hidden ${getStatusBorderColor(apt.status)}`}
                          style={pos}
                        >
                          <div className="text-xs font-bold truncate">{apt.startTime} - {apt.endTime}</div>
                          <div className="text-sm truncate">{apt.clientName}</div>
                          <div className="text-xs text-muted-foreground truncate">{apt.employeeName}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No hay datos para este día
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
