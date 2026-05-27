import * as React from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
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
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white rounded-3xl p-2 px-4 font-semibold flex items-center gap-2 cursor-pointer">
          <Trash2 className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="bg-transparent border-neutral-700 text-white hover:bg-neutral-800">
              Cancelar
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
