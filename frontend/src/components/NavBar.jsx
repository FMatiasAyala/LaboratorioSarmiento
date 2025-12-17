import React, { useState } from "react"
import { NavLink, Link, useLocation } from "react-router-dom"

const base =
  "inline-flex items-center font-medium transition px-2 py-1.5 rounded-md"
const active = "text-[#A63A3A] border-b-2 border-[#A63A3A]"
const inactive =
  "text-[#333] hover:text-[#A63A3A] hover:border-b-2 hover:border-[#A63A3A]"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [openSub, setOpenSub] = useState(null);

  const handleInicioClick = () => {
    if (location.pathname === "/inicio") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const links = [
    { to: "/inicio", label: "Inicio" },
    { to: "/servicios", label: "Servicios" },
    { to: "/nosotros", label: "Laboratorio" },
    { to: "/pacientes", label: "Pacientes" },
    { to: "/contacto", label: "Contacto" },
  ]

  // Submenús
  const subMenus = {
    Servicios: [
      { to: "/servicios/analisis-clinicos", label: "Análisis Clínicos" },
      { to: "/servicios/diagnostico-patologias", label: "Diagnostico de Patologias " },
    ],
    Laboratorio: [
      { to: "/nosotros/equipo", label: "Nuestro Equipo" },
      { to: "/nosotros/instalaciones", label: "Instalaciones" },
    ],
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-bold tracking-wide">
          <img src="/logos/logo2.jpg" className="w-30 h-10" />
        </Link>

        {/* ===== DESKTOP ===== */}
        <nav className="hidden md:flex items-center gap-4 relative">
          {links.map(({ to, label }) => {
            const submenu = subMenus[label]

            if (submenu) {
              const isParentActive =
                location.pathname === to ||
                submenu.some((s) => location.pathname.startsWith(s.to))

              return (
                <div key={label} className="relative group flex items-center gap-1">

                  {/* LINK PRINCIPAL (NAVEGA) */}
                  <NavLink
                    to={to}
                    className={[
                      base,
                      isParentActive ? active : inactive,
                    ].join(" ")}
                  >
                    {label}
                  </NavLink>

                  {/* FLECHA (HOVER SUBMENU) */}
                  <span className="text-xs cursor-default select-none">
                    ▾
                  </span>

                  {/* SUBMENU */}
                  <div
                    className="invisible absolute left-0 top-full z-40 flex min-w-[200px] flex-col
                       rounded-md bg-white/95 text-[#333] shadow-lg opacity-0
                       transition-all duration-150 group-hover:visible group-hover:opacity-100"
                    style={{ paddingTop: "0.5rem" }}
                  >
                    {submenu.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          [
                            "px-4 py-2 text-sm font-medium transition whitespace-nowrap",
                            isActive
                              ? "bg-[#A63A3A] text-white"
                              : "hover:bg-[#f1f1f1]",
                          ].join(" ")
                        }
                      >
                        {label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <NavLink
                key={to}
                to={to}
                onClick={label === "Inicio" ? handleInicioClick : undefined}
                className={({ isActive }) =>
                  [base, isActive ? active : inactive].join(" ")
                }
              >
                {label}
              </NavLink>
            )
          })}
        </nav>


        {/* ===== MOBILE TOGGLE ===== */}
        <button
          className="md:hidden text-[#a63a3a] text-2xl"
          aria-label="Abrir menú"
          onClick={() => {
            setOpen((v) => !v)
            setOpenSub(null)
          }}
        >
          ☰
        </button>
      </div>

      {/* ===== MOBILE ===== */}
      {open && (
        <div className="md:hidden bg-[#a63a3a] border-t border-white/10">
          <nav className="container mx-auto flex flex-col px-4 py-3 gap-2">
            {links.map(({ to, label }) => {
              const submenu = subMenus[label]

              if (submenu) {
                const isOpen = openSub === label

                return (
                  <div key={label}>
                    <div className="flex items-center justify-between">
                      {/* LINK QUE NAVEGA */}
                      <NavLink
                        to={to}
                        onClick={() => {
                          setOpen(false)
                          setOpenSub(null)
                        }}
                        className="px-3 py-2 rounded-md text-white flex-1"
                      >
                        {label}
                      </NavLink>

                      {/* BOTÓN SUBMENU */}
                      <button
                        type="button"
                        onClick={() => setOpenSub(isOpen ? null : label)}
                        className="px-3 py-2 text-white"
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                    </div>

                    {isOpen && (
                      <div className="ml-4 mt-1 flex flex-col gap-1">
                        {submenu.map((s) => (
                          <NavLink
                            key={s.to}
                            to={s.to}
                            onClick={() => {
                              setOpen(false)
                              setOpenSub(null)
                            }}
                            className="px-3 py-2 text-sm rounded-md text-white/90 hover:bg-white/10"
                          >
                            {s.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }


              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => {
                    if (
                      label === "Inicio" &&
                      location.pathname === "/inicio"
                    ) {
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    setOpen(false)
                  }}
                  className={({ isActive }) =>
                    [
                      "px-3 py-2 rounded-md",
                      isActive
                        ? "bg-white/10 text-[#bfbfbf]"
                        : "text-white",
                    ].join(" ")
                  }
                >
                  {label}
                </NavLink>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )

}
