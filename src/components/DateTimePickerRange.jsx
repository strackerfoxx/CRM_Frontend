"use client"
import { useState } from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { set } from "zod"

export function DatePickerWithRange({ date, setDate }) {
  // const [date, setDate] = useState({
  //   from: new Date(new Date().setDate(new Date().getDate() - 7)),
  //   to: new Date(),
  // })

  return (
    <Field className="mx-auto bg-black rounded-md">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal bg-black text-white w-full p-5"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd LLL, y")} -{" "}
                  {format(date.to, "dd LLL, y")}
                </>
              ) : (
                format(date.from, "dd LLL, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-black" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            className={"bg-black"}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
