import React from "react"
import { FaMicroscope, FaNotesMedical, FaUsers, FaClipboardCheck } from "react-icons/fa"

export default function Servicios() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* TÍTULO */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-gray-700 text-lg">
            Realizamos análisis clínicos para la detección, diagnóstico y
            seguimiento de enfermedades y patologías, con atención
            personalizada y profesional.
          </p>
        </header>

        {/* BLOQUE 1 — QUÉ HACEMOS */}
        <div className="bg-white rounded-xl shadow p-8 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <FaMicroscope className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Análisis clínicos
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            En Laboratorio Sarmiento realizamos análisis clínicos orientados
            a la detección temprana, diagnóstico y control de enfermedades.
            Cada estudio se procesa siguiendo estrictos controles de calidad
            y protocolos bioquímicos.
          </p>
        </div>

        {/* BLOQUE 2 — TIPOS DE SERVICIOS */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaNotesMedical className="text-[#A63A3A] text-2xl" />
              <h3 className="text-xl font-semibold">
                Diagnóstico de patologías
              </h3>
            </div>
            <p className="text-gray-700">
              Estudios destinados a identificar enfermedades, evaluar su
              evolución y colaborar con el diagnóstico médico a través
              de resultados confiables.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaClipboardCheck className="text-[#A63A3A] text-2xl" />
              <h3 className="text-xl font-semibold">
                Seguimiento de estudios
              </h3>
            </div>
            <p className="text-gray-700">
              Los resultados atraviesan distintas etapas hasta su validación
              final, garantizando precisión antes de ser entregados al paciente.
            </p>
          </div>

        </div>

        {/* BLOQUE 3 — MODALIDAD DE ATENCIÓN */}
        <div className="bg-white rounded-xl shadow p-8 mb-10">
          <div className="flex items-center gap-4 mb-4">
            <FaUsers className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Modalidad de atención
            </h2>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li>• Atención por <strong>orden de llegada</strong>.</li>
            <li>
              • No trabajamos con turnos, excepto en estudios genéticos
              muy específicos acordados previamente con el paciente.
            </li>
            <li>
              • Horarios: <strong>Lunes a Viernes</strong><br />
              7:00 a 12:30 hs y 17:00 a 20:00 hs.
            </li>
          </ul>
        </div>

        {/* BLOQUE 4 — OBRAS SOCIALES */}
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Obras sociales
          </h2>
          <p className="text-gray-700">
            Atendemos con todas las obras sociales que cuentan con convenio
            vigente con el Colegio de Bioquímicos del Chaco.
          </p>
        </div>

      </div>
    </section>
  )
}
