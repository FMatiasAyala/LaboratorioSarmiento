import React from "react"
import { FaMapMarkerAlt, FaClock, FaEnvelope, FaWhatsapp } from "react-icons/fa"

export default function Ubicacion() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 px-4 items-center">
        {/* Columna texto */}
        <div>
          <h2 className="text-3xl font-bold text-[#A63A3A] mb-6">Dónde estamos</h2>
          <ul className="space-y-4 text-gray-700 text-lg">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#A63A3A] text-xl flex-shrink-0 mt-0.5" />
              <span>
                Av. Sarmiento 680, Resistencia, Chaco.<br />
                Laboratorio Sarmiento.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaClock className="text-[#A63A3A] text-xl flex-shrink-0 mt-0.5" />
              <span>
                Lunes a Viernes: <strong>7:00hs a 12:30hs - 17:00hs a 20:00hs.</strong><br />
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaWhatsapp className="text-[#A63A3A] text-xl flex-shrink-0 mt-0.5" />
              <a
                href="tel:+543414567890"
                className="hover:text-[#A63A3A] transition"
              >
                362 453-2252
              </a>
            </li>
            <li className="flex items-start gap-3">
              <FaEnvelope className="text-[#A63A3A] text-xl flex-shrink-0 mt-0.5" />
              <a
                href="mailto:info@laboratorio.com"
                className="hover:text-[#A63A3A] transition"
              >
                laboratoriosarmientola@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Columna mapa */}
        <iframe
          title="Mapa Laboratorio LA"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7081.036880133105!2d-58.98668085337396!3d-27.45311473465011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450d9edbde90b5%3A0x985d4908d8fa76d8!2sLaboratorio%20La!5e0!3m2!1ses!2sar!4v1762896009915!5m2!1ses!2sar"
          className="w-full h-80 md:h-full rounded-lg shadow-md border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
