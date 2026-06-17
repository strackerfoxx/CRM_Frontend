"use client"

import api from "@/lib/api";
import { useEffect, useRef, useState } from "react";

import { useUser } from "@/hooks/useUser";
import { dateReseter } from "@/middleware/dateReseter";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner"

export default function NotesComponent({ notes, setNotes, id }) {
    const [ newNote, setNewNote ] = useState("")
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isCreatingNote, setIsCreatingNote ] = useState(false)
    const [ editingNoteId, setEditingNoteId ] = useState(null)
    const [ editNoteContent, setEditNoteContent ] = useState("")
    const [ isUpdatingNote, setIsUpdatingNote ] = useState(false)

    const notesContainerRef = useRef(null)

    const { token } = useUser()

    const scrollToBottom = () => {
      if (notesContainerRef.current) {
        notesContainerRef.current.scrollTo({
          top: notesContainerRef.current.scrollHeight,
          behavior: "smooth"
        })
      }
    }

    const handleUpdateNote = async (noteId) => {
        if (!editNoteContent.trim()) return;

        setIsUpdatingNote(true);

        try {
            const { data } = await api.put(
              `${process.env.NEXT_PUBLIC_API_URL}/note/update`,
              {
                  id: noteId,
                  content: editNoteContent
              },
              {
                  headers: {
                    Authorization: token,
                  },
              }
            );

            if (data && data.note) {
              setNotes(prevNotes => 
                  prevNotes.map(n => n.id === noteId ? data.note : n)
              );

              setEditingNoteId(null);
              setEditNoteContent("");
            }
            
            toast.success(data?.msg || "Nota actualizada exitosamente")

        } catch (error) {
            toast.error("Error al actualizar la nota");
            console.error("Error updating note", error);

        } finally {
            setTimeout(() => setIsUpdatingNote(false), 1000)
        }
    };
      
    const deleteNote = async (noteId) => {
      try {
          await api.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/note/delete?id=${noteId}`,
            {
                headers: {
                  Authorization: token,
                },
            }
          );

          setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));

          toast.success("Nota eliminada exitosamente")

      } catch (error) {
          toast.error("Error al eliminar la nota");
          console.error("Error deleting note", error);
      }
    };
      
    const handleCreateNote = async () => {
      if (!newNote.trim()) return;

      setIsCreatingNote(true);

      try {
          const { data } = await api.post(
            `${process.env.NEXT_PUBLIC_API_URL}/note/create`,
            {
                businessClientId: id,
                content: newNote
            },
            {
                headers: {
                  Authorization: token,
                },
            }
          );

          if (data && data.note) {
            setNotes(prevNotes => [...prevNotes, data.note]);
            setNewNote("");

            
          }

          toast.success(data?.msg || "Nota creada exitosamente")

      } catch (error) {
          toast.error("Error al crear la nota");
          console.error("Error creating note", error);

      } finally {
        requestAnimationFrame(() => {
          scrollToBottom()
        })
        setTimeout(() => setIsCreatingNote(false), 1000)
      }
    };

    useEffect(() => {
      if (notes) {
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
      }
    }, [notes])

  return (
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-10">
  {/* Sección: Agregar nota */}
  <div className="bg-neutral-900 rounded-md p-6 flex flex-col gap-4">
    <h3 className="text-lg font-semibold">Agregar nota</h3>
    {isLoading ? (
      <>
        <Skeleton className="w-full h-[150px] bg-neutral-800" />
        <div className="flex justify-end">
          <Skeleton className="w-32 h-10 rounded-3xl bg-neutral-800" />
        </div>
      </>
    ) : (
      <>
        <textarea
          name="notes"
          id="notes"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full h-[150px] bg-neutral-950 text-white rounded-md p-4"
        ></textarea>
        <div className="flex justify-end">
          <button
            onClick={handleCreateNote}
            disabled={isCreatingNote}
            className="bg-blue-600 p-2 rounded-3xl font-semibold px-4 disabled:opacity-50 cursor-pointer hover:bg-blue-800"
          >
            {isCreatingNote ? "Guardando..." : "Guardar nota"}
          </button>
        </div>
      </>
    )}
  </div>

  {/* Sección: Lista de Notas */}
  <div className="bg-neutral-900 rounded-md p-6 flex flex-col gap-4">
    <h3 className="text-lg font-semibold">Notas</h3>
    <div className="space-y-4 overflow-y-scroll max-h-[200px] pr-2">
      {isLoading ? (
        // Mostramos 3 skeletons simulando las notas
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-neutral-950 p-4 rounded-md">
            <Skeleton className="h-4 w-24 mb-3 bg-neutral-800" />
            <Skeleton className="h-4 w-full mb-2 bg-neutral-800" />
            <Skeleton className="h-4 w-3/4 bg-neutral-800" />
          </div>
        ))
      ) : (
        notes?.map((note) => (
          <div key={note.id} className="bg-neutral-950 p-4 rounded-md group relative">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-neutral-400 m-0">
                {dateReseter(note.updatedAt, "dd-mm-yyy")}
              </p>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-between">
                {editingNoteId !== note.id && (
                  <button
                    onClick={() => {
                      setEditingNoteId(note.id);
                      setEditNoteContent(note.content);
                    }}
                    className="text-xs text-blue-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Editar
                  </button>
                )}
                {editingNoteId !== note.id && (
                  <button
                    onClick={() => {
                      deleteNote(note.id);
                    }}
                    className="text-xs text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Borrar
                  </button>
                )}
              </div>
            </div>

            {editingNoteId === note.id ? (
              <div className="flex flex-col gap-2 mt-2">
                <textarea
                  value={editNoteContent}
                  onChange={(e) => setEditNoteContent(e.target.value)}
                  className="w-full bg-neutral-900 text-white rounded-md p-3 min-h-[80px]"
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    onClick={() => {
                      setEditingNoteId(null);
                      setEditNoteContent("");
                    }}
                    className="text-xs text-neutral-400 hover:text-white px-2 py-1"
                    disabled={isUpdatingNote}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleUpdateNote(note.id)}
                    disabled={isUpdatingNote}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1 disabled:opacity-50"
                  >
                    {isUpdatingNote ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white">{note.content}</p>
            )}
          </div>
        ))
      )}
    </div>
  </div>
</div>
  )
}
