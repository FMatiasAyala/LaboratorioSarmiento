import React from "react"
import { FaNotesMedical, FaClock, FaCheckCircle } from "react-icons/fa"

export default function DiagnosticoPatologias() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Diagnóstico de patologías
          </h1>
          <p className="text-gray-700 text-lg">
            Los estudios de laboratorio son una herramienta fundamental
            para el diagnóstico y seguimiento de distintas patologías.
          </p>
        </header>

        {/* Bloque 1 */}
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaNotesMedical className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Proceso de análisis
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Cada estudio atraviesa distintas etapas antes de ser entregado,
            asegurando la confiabilidad de los resultados informados
            al profesional médico y al paciente.
          </p>
        </div>

        {/* Estados */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <FaClock className="text-[#A63A3A] text-3xl mx-auto mb-3" />
            <h3 className="font-semibold mb-2">En proceso</h3>
            <p className="text-gray-700 text-sm">
              El estudio se encuentra en etapa de análisis.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <FaNotesMedical className="text-[#A63A3A] text-3xl mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Con resultado</h3>
            <p className="text-gray-700 text-sm">
              El estudio ya cuenta con resultados preliminares.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <FaCheckCircle className="text-[#A63A3A] text-3xl mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Validado</h3>
            <p className="text-gray-700 text-sm">
              Resultados validados y disponibles para entrega.
            </p>
          </div>

        </div>

        {/* Tiempos */}
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-semibold mb-3">
            Tiempos de entrega
          </h2>
          <p className="text-gray-700 leading-relaxed">
            El tiempo de entrega de resultados varía según el estudio.
            Cada análisis tiene configurado su propio plazo, y en algunos
            casos los resultados pueden entregarse de forma parcial,
            sin esperar la finalización de todos los estudios solicitados.
          </p>
        </div>

      </div>
    </section>
  )
}
