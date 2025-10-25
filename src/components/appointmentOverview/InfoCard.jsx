

export default function InfoCard({ title, value, subtitle }) {
  return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-sm font-medium text-neutral-400">{title}</p>
        <p className="mt-2 text-xl font-semibold text-white">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>}
      </div>
  )
}
