import React from "react"
import { FaMicroscope, FaClipboardList, FaUserCheck } from "react-icons/fa"

export default function AnalisisClinicos() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Análisis clínicos
          </h1>
          <p className="text-gray-700 text-lg">
            Realizamos estudios de laboratorio orientados a la prevención,
            detección y seguimiento de enfermedades, bajo estrictos controles
            de calidad.
          </p>
        </header>

        {/* Bloque 1 */}
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FaMicroscope className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Estudios de laboratorio
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Los análisis clínicos permiten evaluar el estado general de salud,
            detectar alteraciones y colaborar con el diagnóstico médico.
            Cada muestra es procesada siguiendo protocolos bioquímicos
            estandarizados.
          </p>
        </div>

        {/* Bloque 2 */}
        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaClipboardList className="text-[#A63A3A] text-2xl" />
              <h3 className="text-xl font-semibold">
                Preparación del paciente
              </h3>
            </div>
            <p className="text-gray-700">
              Algunos estudios requieren preparación previa. Las indicaciones
              dependen del pedido médico y pueden incluir ayuno u otras
              recomendaciones específicas.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-3 mb-3">
              <FaUserCheck className="text-[#A63A3A] text-2xl" />
              <h3 className="text-xl font-semibold">
                Atención personalizada
              </h3>
            </div>
            <p className="text-gray-700">
              Nuestro equipo acompaña al paciente durante todo el proceso,
              brindando información clara y asistencia en cada etapa del estudio.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}
