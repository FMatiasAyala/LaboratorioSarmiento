import { FaFlask, FaCalendarAlt, FaUser, FaFileMedical, FaSignOutAlt } from "react-icons/fa"
import { NavLink, useNavigate } from "react-router-dom"

export default function Sidebar() {
  const navigate = useNavigate()

  const links = [
    { to: "/portal", icon: <FaFileMedical />, label: "Resultados" },
    { to: "/portal/preparaciones", icon: <FaFlask />, label: "Preparaciones" },
    { to: "/portal/perfil", icon: <FaUser />, label: "Perfil" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    localStorage.removeItem("token")
    navigate("/portal/login")
  }

  return (
    <aside className="w-64 bg-[#A63A3A] text-white h-screen p-4 flex flex-col justify-between">
      {/* Bloque superior */}
      <div>
        {/* Logo institucional */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/logos/logo.jpg"
            alt="Laboratorio Clínico"
            className="h-10 w-30 object-contain rounded-md"
          />
        </div>

        {/* Navegación */}
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bloque inferior */}
      <div className="border-t border-white/20 mt-6 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition"
        >
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </button>

        <p className="text-xs text-white/70 mt-6 text-center leading-tight">
          © 2025 Laboratorio Clínico<br />
          Todos los derechos reservados
        </p>
      </div>
    </aside>
  )
}
