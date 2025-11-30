"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useBusiness } from "@/hooks/useBusiness"

export function DateTimePicker({date, setDate, }) {

  const { business } = useBusiness()
  const [open, setOpen] = useState(false)

  const orderedDays = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  // Convertimos el objeto a array ordenado
  const businessHoursArray = orderedDays.map(day => ({
    day,
    ...business.businessHours[day]
  }));


  const blockedDays = businessHoursArray
    .filter(dayInfo => dayInfo.closed) // Filtra los días que están cerrados
    .map(dayInfo => {
      // Devuelve el índice del día (0 para domingo, 1 para lunes, etc.)
      return orderedDays.indexOf(dayInfo.day);
  });


  // currentDate es todo el conjunto de dias que aparecen en el mes seleccionado
  const isBlocked = (currentDate) => {
    currentDate.setHours(0, 0, 0, 0);

    const day = currentDate.getDay();

    // Bloqueamos los dias pasados
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if( currentDate < today ) return true;

    if (day === parseInt(blockedDays)) return true;

    return false; // resto de los días habilitados
  };

  return (
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
              disabled={isBlocked}
            />
          </PopoverContent>
        </Popover>
      </div>
  )
}
