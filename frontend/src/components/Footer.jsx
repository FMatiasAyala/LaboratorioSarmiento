import React from "react"
import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa"
import { FiMail } from "react-icons/fi"
import { FaMapLocation } from "react-icons/fa6"


export default function Footer() {
  return (
    <footer className="bg-[#A63A3A] text-gray-100 pt-14 pb-8 mt-10">
      <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10 pb-10">
        {/* Columna 1 */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">Dirección</h4>
          <div className="flex items-start gap-3 text-gray-300 text-sm mb-2">
            <FaMapLocation size={18} className="text-white/80 mt-0.5" />
            <p>Av. Sarmiento 680 - Resistencia, Chaco</p>
          </div>

        </div>

        {/* Columna 2 */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">Servicios</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/servicios/diagnostico-por-imagen" className="hover:text-white transition">
                Analisis para detección
              </Link>
            </li>
            <li>
              <Link to="/servicios/terapia-radiante" className="hover:text-white transition">
                Diagnostico de enfermedades/patologías
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">Contacto</h4>
          <div className="flex items-start gap-3 text-gray-300 text-sm mb-2">
            <FiMail size={18} className="text-white/80 mt-0.5" />
            <p>laboratoriosarmientola@gmail.com</p>
          </div>
          <div className="flex items-start gap-3 text-gray-300 text-sm mb-2">
            <FaWhatsapp size={18} className="text-white/80 mt-0.5" />
            <p>(362) 453-2252</p>
          </div>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.facebook.com/InstitutoCRR"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/institutocrr/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Columna 4 */}
        <div>
          <h4 className="font-bold text-white text-lg mb-4">Portal de pacientes</h4>
          <p className="text-sm text-gray-300 mb-4 leading-relaxed">
            Accedé a turnos inmediatos y recordatorios automáticos desde nuestra
            plataforma digital.
          </p>
                    <Link
            to="https://bulonxpress.online/portal"
            className="inline-block bg-white text-[#0A2342] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition"
          >
            Ingresar
          </Link>
        </div>
      </div>

      {/* Footer inferior */}
      <p className="text-center text-sm text-white mt-8">
        © {new Date().getFullYear()} Laboratorio LA. Todos los derechos reservados.
      </p>
    </footer>
  )
}
