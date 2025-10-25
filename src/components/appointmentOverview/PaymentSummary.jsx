
export default function PaymentSummary({services}) {

  const total = services?.reduce((acc, s) => acc + (s.service.price || 0), 0) || 0;

  return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 ">
        <p className="text-sm font-medium text-neutral-400">Resumen de Pago</p>
        <div className="mt-4 space-y-3 overflow-y-auto h-[7.5rem] overflow-x-hidden">
          {services && services.map((s, index) => (
            <div key={index} className="flex items-center justify-between text-neutral-400">
              <span>{s.service.name}</span>
              <span>${s.service.price}</span>
            </div>
          ))}
          
        
        </div>
        <div className="my-4 border-t border-dashed border-neutral-800"></div>
        <div className="flex items-baseline justify-between pt-2">
          <span className="font-semibold text-white">Total</span>
          <span className="text-2xl font-bold text-blue-500">${total}</span>
        </div>
    </div>
  )
}
