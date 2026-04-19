import { DatePickerWithRange } from '@/components/DateTimePickerRange'

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AppointmentFilterBar(
  { 
    category, 
    setCategory, 
    service, 
    setService, 
    status, 
    setStatus, 
    search, 
    setSearch, 
    date,
    setDate,
    services,
    onSubmit 
  }) {
  return (
    <>
        <div className='m-5 p-5 bg-neutral-900 rounded-2xl '>

            {/* Search and Date Range */}
            <div className='md:flex flex-1 gap-5 md:flex-row flex-col items-center justify-between mb-5'>
                <div className="flex text-center items-center gap-3 px-3 bg-black rounded-lg border border-neutral-800 text-white w-full mb-5 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    <input
                      type="text"
                      name="client"
                      id="client"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar clientes por nombre, telefono o correo..."
                      className="w-full p-2"
                    />
                </div>
                <div className='md:flex justify-between gap-3 items-center'>
                    <DatePickerWithRange date={date} setDate={setDate} />
                    <button type="button" onClick={onSubmit} className="bg-blue-600 p-2 rounded-lg font-semibold px-4 cursor-pointer w-full md:w-48 mt-5 md:mt-0 hidden lg:block">Buscar citas</button>
                </div>
            </div>
            <button type="button" onClick={onSubmit} className="bg-blue-600 p-2 rounded-lg font-semibold px-4 cursor-pointer w-full md:w-48 mt-5 md:mt-0 hidden md:block lg:hidden mb-5">Buscar citas</button>

            <hr className='mb-5 bg-gray-600' />
 
            {/* Filters */}
            <div className=' md:flex flex-1 '>
                <div className='flex justify-between gap-3 items-center bg-black text-white p-2 rounded-lg border border-neutral-800 md:w-48 w-full mr-5 mb-4 md:mb-0 h-10'>
                    <span className='text-gray-600 font-semibold'>Categoría</span>
                    <select
                      name="category"
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-black text-white items-center w-lg"
                    >
                        <option value="cabello">cabello</option>
                        <option value="pestañas">pestañas</option>
                        <option value="uñas">uñas</option>
                        <option value="facial">facial</option>
                        <option value="masajes">masajes</option>
                    </select>
                </div>
                <div className='flex justify-between overflow-hidden gap-3 items-center bg-black text-white p-2 rounded-lg border border-neutral-800 md:w-64 w-full mb-4 md:mb-0 h-10'>
                    <span className='text-gray-600 font-semibold'>Servicio</span>
                    <select
                      name="service"
                      id="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="bg-black text-white items-center w-lg"
                      onSelect={e => setService(e.target.value)}
                    >
                        <option value={undefined}>Selecciona un servicio</option>
                        {services.map(s => (
                          <option value={s.id} key={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mx-5 w-px bg-gray-600 hidden lg:block"></div>

                <div className="lg:flex items-center gap-2 lg:mt-0 mt-10 hidden lg:visible">
                    {statusOptions.map((option) => {
                      const isActive = status === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStatus(option.value)}
                          className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${isActive ? 'bg-blue-950 border-blue-600 text-white' : 'bg-black border-neutral-800 text-slate-500 hover:border-slate-700'}`}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                </div>
            </div>

            {/* Status filters */}
            <div className="items-center gap-2 lg:mt-0 md:mt-5 mt-10 lg:hidden">
                {statusOptions.map((option) => {
                  const isActive = status === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatus(option.value)}
                      className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-black border-neutral-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {option.label}
                    </button>
                  )
                })}
            </div>

            <button type="button" onClick={onSubmit} className="bg-blue-600 p-2 rounded-lg font-semibold px-4 cursor-pointer w-full md:w-48  mt-5 md:mt-0 md:hidden">Buscar citas</button>
        </div>
    </>
  )
}
