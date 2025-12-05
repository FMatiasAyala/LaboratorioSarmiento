import { FaFlask, FaUser, FaFileMedical, FaSignOutAlt, FaUsersCog, FaInfoCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();  // ⬅ obtenemos rol desde AuthContext

  const rol = user?.rol; // "admin" | "paciente"

  // LINKS SEGÚN ROL
  const linksPaciente = [
    { to: "/portal/resultados", icon: <FaFileMedical />, label: "Resultados" },
    { to: "/portal/preparaciones", icon: <FaFlask />, label: "Preparaciones" },
    { to: "/portal/info", icon: <FaInfoCircle />, label: "Información" },
    { to: "/portal/perfil", icon: <FaUser />, label: "Mi Cuenta" },
  ];

  const linksAdmin = [
    { to: "/portal/usuarios", icon: <FaUsersCog />, label: "Gestión Usuarios" },
    { to: "/portal/preparaciones-admin", icon: <FaFlask />, label: "Cargar Preparaciones" },
    { to: "/portal/info-admin", icon: <FaInfoCircle />, label: "Cargar Información" },
    { to: "/portal/perfil", icon: <FaUser />, label: "Mi Cuenta" },
  ];

  const links = rol === "admin" ? linksAdmin : linksPaciente;

  const handleLogout = () => {
    logout(); // ⬅ limpiamos desde AuthContext
    navigate("/portal/login");
  };

  return (
    <aside className="w-64 bg-[#A63A3A] text-white h-screen p-4 flex flex-col justify-between">
      {/* Bloque superior */}
      <div>
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/logos/logo.jpg"
            alt="Laboratorio Clínico"
            className="h-10 w-30 object-contain rounded-md"
          />
        </div>

        {/* Navegación dinámica */}
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

      {/* Footer */}
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
  );
}
