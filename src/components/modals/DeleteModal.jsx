import * as React from "react"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"

export function DeleteModal({ title = "¿Eliminar?", description = "Esta acción es permanente e irreversible. ¿Estás seguro?", onDelete, triggerLabel = "Eliminar" }) {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-3xl py-5 px-4 font-semibold flex items-center gap-2 cursor-pointer">
          <Trash2 className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white p-6">
        <DialogHeader className="flex flex-col items-center gap-4 text-center sm:text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 mb-2">
            <AlertTriangle className="h-7 w-7 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-neutral-400 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex flex-row gap-3 w-full sm:flex-row sm:justify-between sm:space-x-0">
          <DialogClose asChild>
            <Button variant="outline" className="flex-1 bg-transparent border-neutral-700 text-white hover:bg-neutral-800 w-full cursor-pointer">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white w-full cursor-pointer">
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
