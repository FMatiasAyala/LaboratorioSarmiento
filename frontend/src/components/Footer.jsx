import React from "react"
import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa"
import { FiMail } from "react-icons/fi"
import { FaMapLocation } from "react-icons/fa6"

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL

export default function Footer() {
  return (
    <footer className="bg-[#A63A3A] text-gray-100 pt-14 pb-8 mt-16">
      <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10 pb-10">

        {/* Columna 1 — Dirección */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">
            Dirección
          </h4>
          <div className="flex items-start gap-3 text-gray-300 text-sm">
            <FaMapLocation size={18} className="text-white/80 mt-0.5" />
            <p>
              Av. Sarmiento 680<br />
              Resistencia, Chaco
            </p>
          </div>
        </div>

        {/* Columna 2 — Servicios */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">
            Servicios
          </h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link
                to="/servicios/analisis-clinicos"
                className="hover:text-white transition"
              >
                Análisis clínicos
              </Link>
            </li>
            <li>
              <Link
                to="/servicios/diagnostico-patologias"
                className="hover:text-white transition"
              >
                Diagnóstico de enfermedades
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 — Contacto */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">
            Contacto
          </h4>

          <div className="flex items-start gap-3 text-gray-300 text-sm mb-2">
            <FiMail size={18} className="text-white/80 mt-0.5" />
            <a
              href="mailto:laboratoriosarmientola@gmail.com"
              className="hover:text-white transition"
            >
              laboratoriosarmientola@gmail.com
            </a>
          </div>

          <div className="flex items-start gap-3 text-gray-300 text-sm mb-2">
            <FaWhatsapp size={18} className="text-white/80 mt-0.5" />
            <a
              href="https://wa.me/543624532252"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              362 453-2252
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-1">
            Consultas únicamente por WhatsApp
          </p>

          {/* Redes (si no existen, se pueden ocultar luego) */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Columna 4 — Portal Pacientes */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">
            Portal de pacientes
          </h4>

          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            Consultá tus resultados de laboratorio de forma segura,
            rápida y desde cualquier dispositivo.
          </p>

          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#A63A3A] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            Ingresar al portal
          </a>
        </div>
      </div>

      {/* Footer inferior */}
      <p className="text-center text-sm text-white/80 mt-8">
        © {new Date().getFullYear()} Laboratorio Sarmiento. Todos los derechos reservados.
      </p>
    </footer>
  )
}
