"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from "date-fns"

import { useUser } from "@/hooks/useUser"
import { useBusiness } from "@/hooks/useBusiness"

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
  const [timeSlots, setTimeSlots] = useState([])

  const { token } = useUser()
  const { business } = useBusiness()

  useEffect(() => {
    fetchMonthMetrics(currentMonth)
  }, [currentMonth])

  const fetchMonthMetrics = async (date) => {
    setLoading(true)
    try {
      const startDate = format(startOfMonth(date), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(date), 'yyyy-MM-dd')

      const {data} = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/appointment/calendar-metrics?startDate=${startDate}&endDate=${endDate}`,
            {
                headers: {
                  Authorization: token,
                },
            }
          )

      setMetrics(data)
    } catch (error) {
      console.error("Error fetching calendar metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDayMetrics = async (date) => {
  setDayLoading(true)

  try {
    const formattedDate = new Date(date)
      .toISOString()
      .split("T")[0]

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/appointment/day-metrics`,
      {
        params: {
          date: formattedDate,
        },

        headers: {
          Authorization: token,
        },
      }
    )

    setDayMetrics(response.data)

  } catch (error) {
    console.log(error.response?.data)
    console.log(error.response?.status)

  } finally {
    setDayLoading(false)
  }
}

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  // Custom Calendar rendering logic
  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = "d"
    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    })

    return days.map((day, i) => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const dayMetric = metrics?.dailyMetrics?.find(m => m.date === dateStr)
      const isCurrentMonth = isSameMonth(day, monthStart)

      // let containerClass = "relative h-16 w-full max-w-16 aspect-square rounded-full mx-auto flex flex-col items-center justify-center p-1 transition-colors hover:bg-neutral-800"
      let containerClass = "relative h-16 w-full max-w-16 aspect-square rounded-full mx-auto flex flex-col items-center justify-center p-1 transition-colors hover:bg-neutral-800 border-2 border-transparent"
      if (!isCurrentMonth) {
        containerClass += " text-muted-foreground opacity-50"
      } else if (isSameDay(day, selectedDate)) {
        containerClass += " bg-blue-600 text-white hover:bg-blue-700"
      } else if (isToday(day)) {
        containerClass += " bg-accent text-accent-foreground"
      } else if (dayMetric) {
        const colorMap = {
          'blue': 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-500',
          'green': 'bg-green-500/20 hover:bg-green-500/30 text-green-500',
          'red': 'bg-red-500/20 hover:bg-red-500/30 text-red-500',
          'yellow': 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500',
        }
        containerClass += " " + (colorMap[dayMetric.color] || 'bg-primary/20 text-primary')

      // if (!isCurrentMonth) {
      //   containerClass += " text-muted-foreground opacity-50"
      // } else {
      //   if (dayMetric) {
      //     containerClass += " " + (colorMap[dayMetric.color] || 'bg-primary/20 text-primary')
      //   } else {
      //     containerClass += " hover:bg-accent"
      //   }
        
      //   if (isSameDay(day, selectedDate)) {
      //     containerClass += " border-gray-400 !border-2"
      //   } else if (isToday(day)) {
      //     containerClass += " border-gray-600 !border-2"
      //   } else {
      //   containerClass += " hover:bg-accent"
      //   }
      }

      return (
        <div key={day.toString()} className="flex justify-center items-center py-2">
          <button
            type="button"
            className={containerClass}
            onClick={() => handleDayClick(day)}
          >
            <span className="text-sm font-medium">{format(day, dateFormat)}</span>
            {dayMetric && (
              <span className="text-[10px] mt-1 font-bold leading-none">
                {dayMetric.count} cita{dayMetric.count !== 1 ? 's' : ''}
              </span>
            )}
          </button>
        </div>
      )
    })
  }

  const renderDaysOfWeek = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    return days.map((day) => (
      <div key={day} className="text-center text-muted-foreground font-medium text-sm py-2">
        {day}
      </div>
    ))
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
  // const generateTimeSlots = () => {
  //   const slots = []
  //   for (let i = 8; i <= 20; i++) {
  //     slots.push(`${i.toString().padStart(2, '0')}:00`)
  //   }
  //   console.log(slots)
  //   return slots
  // }
  const generateTimeSlots = (date) => {
    if (!business?.businessHours) return []

    const daysMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    }

    const dayName = daysMap[new Date(date).getDay()]
    const dayConfig = business.businessHours[dayName]

    // cerrado ese día
    if (!dayConfig || dayConfig.closed) return []

    const interval = 60

    const [openHour, openMinute] = dayConfig.open.split(":").map(Number)
    const [closeHour, closeMinute] = dayConfig.close.split(":").map(Number)
    console.log({openHour, openMinute, closeHour, closeMinute})

    const slots = []

    const current = new Date(date)
    current.setHours(openHour, openMinute, 0, 0)

    const end = new Date(date)
    end.setHours(closeHour + 1, closeMinute, 0, 0)

    while (current < end) {
      const hours = current.getHours().toString().padStart(2, "0")
      const minutes = current.getMinutes().toString().padStart(2, "0")

      slots.push(`${hours}:${minutes}`)

      current.setMinutes(current.getMinutes() + interval)
    }
    return setTimeSlots(slots)
  }

    const handleDayClick = (date) => {
    if (!date) return
    setSelectedDate(date)
    setIsModalOpen(true)
    fetchDayMetrics(date)
    generateTimeSlots(date)
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

  const organizeAppointments = (appointments) => {
    if (!appointments || !appointments.length) return { sorted: [], maxColumns: 0 };
    const sorted = appointments.map(a => ({...a})).sort((a, b) => {
      const tA = a.startTime.split(':').map(Number);
      const tB = b.startTime.split(':').map(Number);
      return (tA[0] * 60 + tA[1]) - (tB[0] * 60 + tB[1]);
    });

    const columns = [];
    let lastEventEnding = null;
    let maxColumns = 1;

    const packEvents = () => {
      const numColumns = columns.length;
      if (numColumns > maxColumns) {
        maxColumns = numColumns;
      }
      columns.forEach((col, i) => {
        col.forEach(event => {
          // Fixed width logic instead of percentage to support any number of columns
          const columnWidth = 180;
          event._layout = {
            left: i * (columnWidth + 10), // 10px gap
            width: columnWidth
          };
        });
      });
      columns.length = 0;
    };

    sorted.forEach(ev => {
      const start = ev.startTime.split(':').map(Number);
      const end = ev.endTime.split(':').map(Number);
      ev._startMins = start[0] * 60 + start[1];
      ev._endMins = end[0] * 60 + end[1];

      if (lastEventEnding !== null && ev._startMins >= lastEventEnding) {
        packEvents();
        lastEventEnding = null;
      }

      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col[col.length - 1]._endMins <= ev._startMins) {
          col.push(ev);
          placed = true;
          break;
        }
      }
      if (!placed) {
        columns.push([ev]);
      }

      if (lastEventEnding === null || ev._endMins > lastEventEnding) {
        lastEventEnding = ev._endMins;
      }
    });

    if (columns.length > 0) packEvents();

    return { sorted, maxColumns };
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-tight mb-8 sm:mb-12 break-words overflow-hidden">Calendario de Citas</h1>
      

        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-neutral-900 p-4 rounded-lg w-fit">
            <span className="text-md font-medium">Total Citas del Mes:</span>
            <Badge variant="secondary" className="text-md px-3 py-1">
              {metrics?.totalAppointments || 0}
            </Badge>
          </div>

          <div className="rounded-md border bg-card w-full p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Siguiente mes"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-2">
              {renderDaysOfWeek()}
              {renderCalendarDays()}
            </div>
          </div>
        </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-6xl max-h-[90vh] flex flex-col">
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

              <div className="flex-1 overflow-auto pr-2 pb-4">
                <div className="relative w-full min-h-[720px] mt-4">
                 {(() => {
                    const { sorted, maxColumns } = organizeAppointments(dayMetrics.appointments);
                    // Ensure minimum width of 100% or calculated width based on columns
                    const containerMinWidth = Math.max(100, (maxColumns * 190) + 60); // 180 + 10 gap + 60 left padding

                    return (
                      <div className="relative min-h-[720px]" style={{ minWidth: `${containerMinWidth}px` }}>
                        {/* Background grid for time slots (08:00 to 20:00 = 12 hours * 60px = 720px) */}
                        {timeSlots.map((time, i) => (
                          <div
                            key={time}
                            className="absolute w-full flex items-start border-t border-border/50 text-xs text-muted-foreground"
                            style={{ top: `${i * 60}px`, height: '60px' }}
                          >
                            <span className="w-12 -mt-2 pr-2 text-right bg-background sticky left-0 z-10">{time}</span>
                            <div className="flex-1 h-full border-l border-border/50 pl-2"></div>
                          </div>
                        ))}

                        {/* Appointments Blocks */}
                        <div className="absolute left-14 right-0 top-0 bottom-0">
                          {sorted?.map((apt, i) => {
                            const pos = calculatePosition(apt.startTime, apt.endTime)
                            return (
                              <Link href={`/main/appointments/${apt.id}`} passHref key={i}>
                                <div
                                  className={`absolute bg-card p-2 rounded-md border-l-4 shadow-sm overflow-hidden cursor-pointer ${getStatusBorderColor(apt.status)}`}
                                  style={{
                                    ...pos,
                                    left: `${apt._layout?.left || 0}px`,
                                    width: `${apt._layout?.width || 180}px`
                                  }}
                                >
                                  {console.log(apt)}
                                  <div className="text-xs font-bold truncate">{apt.startTime} - {apt.endTime}</div>
                                  <div className="text-sm truncate">{apt.clientName}</div>
                                  <div className="text-xs text-muted-foreground truncate">{apt.employeeName}</div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
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
