import React from "react"
import {
  FaMapMarkerAlt,
  FaClock,
  FaEnvelope,
  FaWhatsapp,
  FaInfoCircle,
} from "react-icons/fa"

export default function Ubicacion() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 px-4 items-center">
        {/* Columna texto */}
        <div>
          <h2 className="text-3xl font-bold text-[#A63A3A] mb-6">
            Dónde estamos
          </h2>

          <ul className="space-y-5 text-gray-700 text-base md:text-lg">
            {/* Dirección */}
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#A63A3A] text-xl flex-shrink-0 mt-1" />
              <span>
                <strong>Av. Sarmiento 680</strong>, Resistencia, Chaco.<br />
                Laboratorio Sarmiento.
              </span>
            </li>

            {/* Horarios */}
            <li className="flex items-start gap-3">
              <FaClock className="text-[#A63A3A] text-xl flex-shrink-0 mt-1" />
              <span>
                <strong>Horarios de atención</strong><br />
                Lunes a Viernes<br />
                7:00 a 12:30 hs · 17:00 a 20:00 hs
              </span>
            </li>

            {/* Modalidad */}
            <li className="flex items-start gap-3">
              <FaInfoCircle className="text-[#A63A3A] text-xl flex-shrink-0 mt-1" />
              <span>
                Atención por <strong>orden de llegada</strong>.<br />
                No trabajamos con turnos (excepto estudios genéticos específicos
                previamente acordados).
              </span>
            </li>

            {/* WhatsApp */}
            <li className="flex items-start gap-3">
              <FaWhatsapp className="text-[#A63A3A] text-xl flex-shrink-0 mt-1" />
              <a
                href="https://wa.me/5493624532252"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#A63A3A] transition"
              >
                (+54) 9 362 453-2252<br />
                <span className="text-sm text-gray-500">
                  (consultas únicamente por WhatsApp)
                </span>
              </a>
            </li>

            {/* Email */}
            <li className="flex items-start gap-3">
              <FaEnvelope className="text-[#A63A3A] text-xl flex-shrink-0 mt-1" />
              <a
                href="mailto:laboratoriosarmientola@gmail.com"
                className="hover:text-[#A63A3A] transition"
              >
                laboratoriosarmientola@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Columna mapa */}
        <div className="w-full h-[300px] md:h-[420px] rounded-lg overflow-hidden shadow-md">
          <iframe
            title="Mapa Laboratorio Sarmiento"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7081.036880133105!2d-58.98668085337396!3d-27.45311473465011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450d9edbde90b5%3A0x985d4908d8fa76d8!2sLaboratorio%20La!5e0!3m2!1ses!2sar!4v1762896009915!5m2!1ses!2sar"
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
