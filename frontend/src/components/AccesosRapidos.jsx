import React from "react"
import { Link } from "react-router-dom"

function AccesosRapidos() {
  const accesos = [
    { title: "Solicitar Turno", img: "/icons/turnos.png", to: "/turnos" },
    { title: "Portal Pacientes", img: "/icons/estudios.png", to: `http://localhost:5173/portal/` },
    { title: "Novedades", img: "/icons/novedades.png", to: "/novedades" },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6 grid gap-6 md:grid-cols-3 cursor-pointer">
        {accesos.map((a, i) => (
          <Link key={a.to} to={a.to}>
            <div
              key={i}
              className="bg-gray-50 rounded-xl shadow-md p-6 text-center hover:shadow-lg hover:bg-[#D18A8A] hover:-translate-y-4 transition-all duration-300"
            >
              <img src={a.img} alt={a.title} className="mx-auto mb-4 w-16 h-16" />
              <h4 className="text-lg font-semibold text-black">
                {a.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default AccesosRapidos
