"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenuItem onClick={(e) => {
        e.preventDefault()
        setTheme(theme === "dark" ? "light" : "dark")
      }}>
      <div className="flex items-center gap-2 w-full cursor-pointer">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
      </div>
    </DropdownMenuItem>
  )
}
