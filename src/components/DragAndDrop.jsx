'use client';

import { useState, useEffect } from 'react';
import { useAppointment } from '@/hooks/useAppointment';
import {
  DndContext,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



// === Item individual ===
function SortableItem({ id, title, date, status }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-black shadow-neutral-800 text-white rounded-xl shadow p-3 mb-3 cursor-grab active:cursor-grabbing hover:bg-neutral-800 transition-colors"
    >
      <h3 className="font-semibold">Cliente: {title}</h3>
      <p className="text-xs text-neutral-500 mt-1">📅 {date}</p>
      <p className="text-xs text-neutral-500 mt-1">Status: <span className='font-semibold text-white'>{status}</span></p>
    </div>
  );
}

// === Columna ===
function Column({ id, title, tasks }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="p-4 rounded-2xl border border-neutral-800 shadow-inner bg-neutral-950"
    >
      <h2 className="font-semibold text-lg mb-4 text-neutral-200 capitalize">{title}</h2>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableItem key={task.id} id={task.id} title={task.title} date={task.date} status={task.status} />
        ))}
      </SortableContext>
    </div>
  );
}

export default function Dashboard() {
  const [columns, setColumns] = useState({});

  const { appointments } = useAppointment();

  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumnId = Object.keys(columns).find((col) =>
      columns[col].some((t) => t.id === activeId)
    );

    const overColumnId = Object.keys(columns).find((col) =>
      columns[col].some((t) => t.id === overId) || col === overId
    );

    if (!activeColumnId || !overColumnId) return;

    if (activeColumnId !== overColumnId) {
      const fromTasks = [...columns[activeColumnId]];
      const toTasks = [...columns[overColumnId]];
      const [moved] = fromTasks.splice(fromTasks.findIndex((t) => t.id === activeId), 1);

      // Si se suelta en columna vacía
      const overIndex = toTasks.findIndex((t) => t.id === overId);
      if (overIndex === -1) toTasks.push(moved);
      else toTasks.splice(overIndex, 0, moved);

      setColumns({
        ...columns,
        [activeColumnId]: fromTasks,
        [overColumnId]: toTasks,
      });
    } else {
      const column = columns[activeColumnId];
      const oldIndex = column.findIndex((t) => t.id === activeId);
      const newIndex = column.findIndex((t) => t.id === overId);

      if (oldIndex !== newIndex) {
        setColumns({
          ...columns,
          [activeColumnId]: arrayMove(column, oldIndex, newIndex),
        });
      }
    }
  };

  useEffect(() => {

    const grouped = {
      Citas: appointments
        .filter(a => a.status === "SCHEDULED")
        .map(a => ({
          id: a.id,
          title: `Cita con ${a.businessClient.client.name.slice(0, 5)}...`,
          clientId: a.businessClient.id,
          status: a.status,
          date: a.date,
        })),
      Completadas: appointments
        .filter(a => a.status === "CONFIRMED")
        .map(a => ({
          id: a.id,
          title: `Cita confirmada ${a.businessClient.client.name.slice(0, 5)}...`,
          clientId: a.businessClient.id,
          status: a.status,
          date: a.date,
        })),
      Confirmadas: appointments
        .filter(a => a.status === "COMPLETED")
        .map(a => ({
          id: a.id,
          title: `Terminada ${a.businessClient.client.name.slice(0, 5)}...`,
          clientId: a.businessClient.id,
          status: a.status,
          date: a.updatedAt,
        })),
      Canceladas: appointments
        .filter(a => a.status === "CANCELED")
        .map(a => ({
          id: a.id,
          title: `Terminada ${a.businessClient.client.name.slice(0, 5)}...`,
          clientId: a.businessClient.id,
          status: a.status,
          date: a.updatedAt,
        })),
    };

  setColumns(grouped);
  }, [appointments])


  return (
    <div className="p-6 min-h-screen text-white flex align-middle flex-col">
      <h1 className="text-2xl font-bold mb-6">CRM Dashboard</h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id)}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-6 w-full">
          {Object.entries(columns).map(([colId, tasks]) => (
            <Column key={colId} id={colId} title={colId} tasks={tasks} />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <SortableItem
              id={activeId}
              title={
                Object.values(columns)
                  .flat()
                  .find((t) => t.id === activeId)?.title || ''
              }
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
