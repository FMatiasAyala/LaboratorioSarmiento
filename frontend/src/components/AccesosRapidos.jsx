import React from "react"
import { Link } from "react-router-dom"
import { FaFileMedical, FaUsers, FaClock } from "react-icons/fa"

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL

function AccesosRapidos() {
  const accesos = [
    {
      title: "Portal de Resultados",
      to: PORTAL_URL,
      icon: <FaFileMedical size={36} />,
      external: true,
    },
    {
      title: "Nuestro equipo",
      icon: <FaUsers size={36} />,
      to: "/nosotros/equipo",
    },
    {
      title: "Horarios y Contacto",
      to: "/nosotros/contacto",
      icon: <FaClock size={36} />,
    },
  ]

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6 grid gap-6 md:grid-cols-3">
        {accesos.map((a) => {
          const Card = (
            <div
              className="
                bg-gray-50 rounded-xl shadow-md p-6 text-center
                hover:shadow-lg hover:bg-[#D18A8A]
                hover:-translate-y-2 transition-all duration-300
              "
            >
              <div className="flex justify-center mb-4 text-[#A63A3A]">
                {a.icon}
              </div>

              <h4 className="text-lg font-semibold text-black">
                {a.title}
              </h4>
            </div>
          )

          return a.external ? (
            <a
              key={a.title}
              href={a.to}
              target="_blank"
              rel="noopener noreferrer"
            >
              {Card}
            </a>
          ) : (
            <Link key={a.title} to={a.to}>
              {Card}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default AccesosRapidos
