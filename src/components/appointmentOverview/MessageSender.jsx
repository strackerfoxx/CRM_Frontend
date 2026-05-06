// "use client"
// import { useState } from "react";
// import { useUser } from "@/hooks/useUser";

// import "@/css/message.css"

// const WhatsAppIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className='col text-green-400' viewBox="0 0 256 258">
//         <path fill="#fff" d="M128.534 0c34.098.017 66.102 13.29 90.167 37.383c24.066 24.092 37.312 56.12 37.299 90.174c-.028 69.579-56.076 126.318-125.36 127.446l-2.103.017h-.053c-21.005-.007-41.65-5.194-60.051-15.045l-.86-.466L0 257.233l18.083-66.055C6.93 171.852 1.061 149.922 1.07 127.455C1.098 57.178 58.279 0 128.534 0Zm.044 21.53c-58.437 0-105.964 47.523-105.987 105.936c-.008 19.712 5.424 38.921 15.719 55.612l.478.769l2.52 4.009l-10.703 39.093l40.097-10.517l3.869 2.294c16.007 9.499 34.32 14.599 53.017 14.764l.905.004h.044c58.392 0 105.918-47.526 105.942-105.943c.01-28.308-10.998-54.927-31.001-74.952c-20.003-20.024-46.603-31.06-74.9-31.07Zm-45.17 47.063c2.122 0 4.25.02 6.104.115c1.956.096 4.581-.743 7.165 5.466c.992 2.38 2.5 6.057 4.044 9.813l.331.805c2.485 6.045 4.969 12.072 5.447 13.029c.795 1.593 1.325 3.455.264 5.579c-1.06 2.127-1.593 3.454-3.184 5.316c-1.593 1.858-3.344 4.153-4.777 5.579a57.05 57.05 0 0 0-.234.233l-.232.237c-1.42 1.469-2.608 3.153-.93 6.027c1.857 3.19 8.248 13.622 17.716 22.066c12.165 10.85 22.428 14.214 25.613 15.809c3.184 1.594 5.043 1.328 6.9-.8c1.859-2.124 7.961-9.298 10.085-12.487c2.123-3.188 4.246-2.655 7.166-1.593c1.387.505 5.654 2.511 10.092 4.649l1.38.666c4.443 2.15 8.776 4.288 10.29 5.046c3.185 1.595 5.309 2.392 6.104 3.719c.796 1.33.796 7.705-1.858 15.145c-2.653 7.44-15.378 14.23-21.497 15.146c-5.487.818-12.43 1.16-20.06-1.262c-4.624-1.47-10.558-3.429-18.157-6.71c-31.948-13.794-52.815-45.966-54.406-48.09l-.108-.144c-1.941-2.594-12.898-17.445-12.898-32.804c0-15.675 8.229-23.38 11.147-26.569c2.92-3.186 6.37-3.986 8.493-3.986Z"></path>
//     </svg>
// );

// export default function MessageSender({client, date, hour}) {
//     const [message, setMessage] = useState("");
//     const { user } = useUser();

//     function sendMessage() {
//         const numero = "5544786218"; // incluye código de país (México +52)
        
//         const url = `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
//         window.open(url, "_blank");
//     }
    
//   return (
//       <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-950 p-6">
//         <h3 className="flex items-center gap-3 text-lg font-semibold text-white">
//         <WhatsAppIcon />
//         Enviar Mensaje
//         </h3>
//         <p className="mt-1 text-sm text-neutral-400">Comunícate directamente con el cliente.</p>
//         <div className="mt-5 space-y-4">
//         <textarea 
//             className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-white placeholder-neutral-400 focus:border-primary focus:ring-primary" 
//             placeholder="Escribe tu mensaje personalizado aquí..." 
//             rows="3"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//         ></textarea>
//         <div className="flex flex-wrap gap-2">
//             <button className="message" 
//                 onClick={() => setMessage(`Hola, ${client.name}, te confirmo una cita para el dia ${date} a las ${hour}! Atentamente, ${user.name}`)}
//             >Confirmación de cita</button>
//             <button className="message" 
//                 onClick={() => setMessage(`Hola, ${client.name}, te recordamos que tu cita es para el dia ${date} a las ${hour}! Atentamente, ${user.name}`)}
//             >Recordatorio</button>
//             <button className="message" 
//                 onClick={() => setMessage(`Hola, ${client.name}, lamentablemente tuvimos que cancelar tu cita del dia ${date} a las ${hour}, lo sentimos mucho. Atentamente, ${user.name}`)}
//             >Avisar cancelacion</button>
//             <button className="message" 
//                 onClick={() => setMessage(`Hola, ${client.name}, retrasado`)}
//             >Avisar retraso</button>
//         </div>
//         <button onClick={sendMessage} className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-500">
//             <span>Enviar vía WhatsApp</span>
//         </button>
//         </div>
//     </div>
//   )
// }




"use client"
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/hooks/useUser";

import "@/css/message.css";

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className='col text-green-400' viewBox="0 0 256 258">
        <path fill="#25d366" d="M128.534 0c34.098.017 66.102 13.29 90.167 37.383c24.066 24.092 37.312 56.12 37.299 90.174c-.028 69.579-56.076 126.318-125.36 127.446l-2.103.017h-.053c-21.005-.007-41.65-5.194-60.051-15.045l-.86-.466L0 257.233l18.083-66.055C6.93 171.852 1.061 149.922 1.07 127.455C1.098 57.178 58.279 0 128.534 0Zm.044 21.53c-58.437 0-105.964 47.523-105.987 105.936c-.008 19.712 5.424 38.921 15.719 55.612l.478.769l2.52 4.009l-10.703 39.093l40.097-10.517l3.869 2.294c16.007 9.499 34.32 14.599 53.017 14.764l.905.004h.044c58.392 0 105.918-47.526 105.942-105.943c.01-28.308-10.998-54.927-31.001-74.952c-20.003-20.024-46.603-31.06-74.9-31.07Zm-45.17 47.063c2.122 0 4.25.02 6.104.115c1.956.096 4.581-.743 7.165 5.466c.992 2.38 2.5 6.057 4.044 9.813l.331.805c2.485 6.045 4.969 12.072 5.447 13.029c.795 1.593 1.325 3.455.264 5.579c-1.06 2.127-1.593 3.454-3.184 5.316c-1.593 1.858-3.344 4.153-4.777 5.579a57.05 57.05 0 0 0-.234.233l-.232.237c-1.42 1.469-2.608 3.153-.93 6.027c1.857 3.19 8.248 13.622 17.716 22.066c12.165 10.85 22.428 14.214 25.613 15.809c3.184 1.594 5.043 1.328 6.9-.8c1.859-2.124 7.961-9.298 10.085-12.487c2.123-3.188 4.246-2.655 7.166-1.593c1.387.505 5.654 2.511 10.092 4.649l1.38.666c4.443 2.15 8.776 4.288 10.29 5.046c3.185 1.595 5.309 2.392 6.104 3.719c.796 1.33.796 7.705-1.858 15.145c-2.653 7.44-15.378 14.23-21.497 15.146c-5.487.818-12.43 1.16-20.06-1.262c-4.624-1.47-10.558-3.429-18.157-6.71c-31.948-13.794-52.815-45.966-54.406-48.09l-.108-.144c-1.941-2.594-12.898-17.445-12.898-32.804c0-15.675 8.229-23.38 11.147-26.569c2.92-3.186 6.37-3.986 8.493-3.986Z"></path>
    </svg>
);

function formatDate(value, options) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("es-MX", options).format(new Date(value));
  } catch {
    return String(value);
  }
}

function parseAppointmentDate(date, time) {
  if (!date) return null;
  const iso = time ? `${date}T${time}` : date;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? new Date(date) : parsed;
}

function normalizePhone(phone) {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

const modesConfig = ({ clientName, dateText, timeText, serviceList, serviceLines, totalPrice, appointmentStatus, userName }) => [
  {
    id: "confirmation",
    label: "Confirmación",
    description: "Envía una confirmación clara con datos de fecha, hora y servicios.",
    template: `Hola ${clientName},\n\n🎫 Confirmación de cita\n────────────────────\nCliente: ${clientName}\nFecha: ${dateText}\nHora: ${timeText}\nServicio(s): ${serviceList}\nTotal: $${totalPrice}\n\n${serviceLines}\n────────────────────\nSi necesitas modificar algo, estoy a tu disposición.\n\nAtentamente,\n${userName}`,
  },
  {
    id: "reminder",
    label: "Recordatorio",
    description: "Recuerda la cita con un formato ordenado y fácil de leer.",
    template: `Hola ${clientName},\n\n⏰ Recordatorio de cita\n────────────────────\nTu cita está agendada para:\nFecha: ${dateText}\nHora: ${timeText}\nServicio(s): ${serviceList}\nTotal: $${totalPrice}\n\nPor favor llega 5 minutos antes.\n\nGracias,\n${userName}`,
  },
  {
    id: "cancellation",
    label: "Cancelación",
    description: "Informa la cancelación con empatía y claridad.",
    template: `Hola ${clientName},\n\n⚠️ Aviso importante\n────────────────────\nLamentablemente tu cita prevista para ${dateText} a las ${timeText} ha sido cancelada.\nServicio(s): ${serviceList}\nTotal: $${totalPrice}\n\nPuedes escribirnos si deseas reagendar o si tienes dudas.\n\nAtentamente,\n${userName}`,
  },
  {
    id: "delay",
    label: "Retraso",
    description: "Aviso de retraso con tono profesional y directo.",
    template: `Hola ${clientName},\n\n⌛ Aviso de retraso\n────────────────────\nTu cita programada para ${dateText} a las ${timeText} lleva un pequeño retraso.\nMantendremos la misma calidad y te avisaremos en cuanto esté lista la nueva hora.\n\nGracias por tu comprensión.\n\n${userName}`,
  },
];

export default function MessageSender({ appointment }) {
  const { user } = useUser();
  const [selectedMode, setSelectedMode] = useState("confirmation");
  const [message, setMessage] = useState("");
  const [templateSnapshot, setTemplateSnapshot] = useState("");
  const [feedback, setFeedback] = useState("idle");

  const clientName = appointment?.businessClient?.client?.name || "cliente";
  const clientPhone = "5544786218" || "";
  const appointmentDate = parseAppointmentDate(appointment?.date, appointment?.startTime);
  const dateText = formatDate(appointmentDate, { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeText = formatDate(appointment.startTime, { hour: "2-digit", minute: "2-digit" });

  const serviceList = appointment?.services?.length
    ? appointment.services.map((s) => s.service.name).join(", ")
    : "Servicio no especificado";

  const serviceLines = appointment?.services?.length
    ? appointment.services.map((s) => `- ${s.service.name} ($${s.service.price || 0})`).join("\n")
    : "- Servicio no especificado";

  const totalPrice = appointment?.services?.reduce(
    (sum, serviceItem) => sum + (serviceItem?.service?.price || 0),
    0
  );

  const appointmentStatus = appointment?.status || "SCHEDULED";

  const currentModeOptions = useMemo(
    () =>
      modesConfig({
        clientName,
        dateText,
        timeText: appointment?.startTime ? timeText : "Hora no especificada",
        serviceList,
        serviceLines,
        totalPrice,
        appointmentStatus,
        userName: user?.name || "Equipo",
      }),
    [clientName, dateText, timeText, serviceList, serviceLines, totalPrice, appointmentStatus, user?.name]
  );

  const recommendedMode = useMemo(() => {
    if (appointmentStatus === "CANCELED") return "cancellation";
    if (!appointmentDate) return "confirmation";

    const now = new Date();
    const diffHours = (appointmentDate.getTime() - now.getTime()) / 1000 / 60 / 60;

    if (diffHours <= 3) return "delay";
    if (diffHours <= 48) return "reminder";
    return "confirmation";
  }, [appointmentDate, appointmentStatus]);

  const selectedModeData = currentModeOptions.find((mode) => mode.id === selectedMode) || currentModeOptions[0];

  useEffect(() => {
    setSelectedMode(recommendedMode);
  }, [recommendedMode]);

  useEffect(() => {
    if (!selectedModeData) return;
    setTemplateSnapshot(selectedModeData.template);
    setMessage(selectedModeData.template);
  }, [selectedModeData]);

  const isSendingDisabled = !message.trim() || feedback === "opening" || !normalizePhone(clientPhone);
  const phoneNumber = normalizePhone(clientPhone) || "5544786218";

  function handleSend() {
    if (!message.trim()) return;

    setFeedback("opening");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
      window.open(whatsappUrl, "_blank");
      setFeedback("ready");
    } catch (error) {
      console.error(error);
      setFeedback("error");
    }
  }

  function handleModeSelect(modeId) {
    setSelectedMode(modeId);
  }

  function restoreTemplate() {
    setMessage(templateSnapshot);
  }

  return (
    <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-950 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-white">
            <WhatsAppIcon />
            Enviar Mensaje
          </h3>
          <p className="mt-1 text-sm text-neutral-400">
            Escoge un modo, revisa la plantilla y envía un mensaje consistente.
          </p>
        </div>
        <div className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-400 ring-1 ring-neutral-800">
          Sugerido: {selectedModeData.label}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {currentModeOptions.map((mode) => {
            const isActive = mode.id === selectedMode;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeSelect(mode.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-950/[50%] border border-blue-500 text-white"
                    : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-neutral-500">{selectedModeData.description}</p>

        <textarea
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-primary focus:ring-primary"
          rows="6"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          spellCheck={false}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={restoreTemplate}
            disabled={message === templateSnapshot}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-white transition hover:border-neutral-700 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Regenerar mensaje
          </button>
          <p className="text-sm text-neutral-500">
            Puedes editar el mensaje o restaurar la plantilla en cualquier momento.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-white">Preview</span>
            <span className="text-xs text-neutral-500">Estilo WhatsApp</span>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[90%] rounded-3xl rounded-br-[10px] bg-[#25d366] px-4 py-3 text-sm leading-6 text-neutral-950 shadow-[0_1px_3px_rgba(0,0,0,0.25)] whitespace-pre-line">
              {message || "Selecciona un modo para ver el mensaje aquí."}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={isSendingDisabled}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <WhatsAppIcon />
            {feedback === "opening"
              ? "Abriendo WhatsApp..."
              : feedback === "ready"
              ? "Mensaje listo"
              : feedback === "error"
              ? "Error al abrir"
              : "Enviar vía WhatsApp"}
          </button>
          <p className="text-sm text-neutral-400">
            {normalizePhone(clientPhone)
              ? `Enviando a ${clientName} (${clientPhone}).`
              : "No se encontró número de cliente. Se usará número de negocio predeterminado."}
          </p>
        </div>
      </div>
    </div>
  );
}
