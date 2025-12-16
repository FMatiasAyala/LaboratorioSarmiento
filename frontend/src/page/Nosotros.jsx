import React from "react"
import {
  FaMicroscope,
  FaUsers,
  FaClock,
  FaClipboardCheck,
} from "react-icons/fa"

export default function Nosotros() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Laboratorio Sarmiento
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Somos un laboratorio de análisis clínicos orientado a la detección,
            diagnóstico y seguimiento de enfermedades, con atención
            profesional y personalizada.
          </p>
        </header>

        {/* BLOQUE — QUIÉNES SOMOS */}
        <div className="bg-white rounded-xl shadow p-8 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <FaMicroscope className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Quiénes somos
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            En Laboratorio Sarmiento trabajamos con un equipo de profesionales
            capacitados y comprometidos con la calidad de cada estudio.
            Nuestra labor se basa en protocolos bioquímicos estandarizados
            y controles rigurosos en cada etapa del proceso.
          </p>
        </div>

        {/* BLOQUE — MODALIDAD DE TRABAJO */}
        <div className="bg-white rounded-xl shadow p-8 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <FaClipboardCheck className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Modalidad de trabajo
            </h2>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li>• Atención por <strong>orden de llegada</strong>.</li>
            <li>
              • No trabajamos con turnos, salvo estudios genéticos
              muy específicos acordados previamente.
            </li>
            <li>
              • Los estudios se procesan y controlan de manera
              manual y personalizada.
            </li>
          </ul>
        </div>

        {/* BLOQUE — HORARIOS */}
        <div className="bg-white rounded-xl shadow p-8 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <FaClock className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Horarios de atención
            </h2>
          </div>

          <p className="text-gray-700">
            <strong>Lunes a Viernes</strong><br />
            7:00 a 12:30 hs<br />
            17:00 a 20:00 hs
          </p>
        </div>

        {/* BLOQUE — EQUIPO (RESUMEN) */}
        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex items-center gap-4 mb-4">
            <FaUsers className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Nuestro equipo
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Nuestro equipo está conformado por profesionales de distintas
            áreas, trabajando de manera coordinada para brindar una atención
            segura y eficiente.
          </p>

          <ul className="grid sm:grid-cols-2 gap-2 text-gray-700">
            <li>• 4 Bioquímicos</li>
            <li>• 2 Técnicas de laboratorio</li>
            <li>• 3 Administrativos</li>
          </ul>
        </div>

      </div>
    </section>
  )
}
