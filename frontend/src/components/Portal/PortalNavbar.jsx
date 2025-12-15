export default function PortalNavbar({ onMenuClick }) {
  return (
    <header className="md:hidden h-14 bg-[#A63A3A] text-white flex items-center px-4 shadow">
      
      {/* Botón menú */}
      <button
        onClick={onMenuClick}
        className="text-2xl mr-3 focus:outline-none"
        aria-label="Abrir menú"
      >
        ☰
      </button>

      {/* Logo + texto */}
      <div className="flex items-center gap-3">
        <img
          src="/logos/logo.jpg"
          alt="Laboratorio Clínico"
          className="h-9 w-auto object-contain rounded"
        />
        <span className="font-semibold text-sm leading-tight">
          Portal<br />LABORATORIO SARMIENTO
        </span>
      </div>

    </header>
  )
}
