import React from "react"
import {
  FaUserMd,
  FaFlask,
  FaUserTie,
} from "react-icons/fa"

export default function Equipo() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Nuestro equipo
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            El Laboratorio Sarmiento cuenta con un equipo de profesionales
            capacitados que trabajan de manera coordinada para garantizar
            resultados confiables y una atención segura.
          </p>
        </header>

        {/* DIRECTOR */}
        <div className="bg-white rounded-xl shadow p-8 mb-12 border-l-4 border-[#A63A3A]">
          <div className="flex items-center gap-4 mb-3">
            <FaUserTie className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Director del laboratorio
            </h2>
          </div>

          <p className="text-gray-700">
            <strong>Director Bioquímico</strong><br />
            Responsable de la supervisión técnica, validación de resultados
            y cumplimiento de los protocolos bioquímicos del laboratorio.
          </p>

          {/* 👇 después podés reemplazar */}
          <p className="text-gray-500 mt-2 italic">
            (Nombre del director)
          </p>
        </div>

        {/* BIOQUÍMICOS */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Bioquímicos
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Dr. Goya Gerardo Adolfo", "Dra. Peyrano Felicitas", "Dra. Kremar Paula Macarena", "Dra. Biancalani Agustina"].map(
              (label) => (
                <div
                  key={label}
                  className="bg-white rounded-xl shadow p-6 text-center"
                >
                  <FaUserMd className="text-[#A63A3A] text-4xl mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800">
                    {label}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Profesional responsable del análisis, control y validación
                    de estudios clínicos.
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* TÉCNICAS DE LABORATORIO */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Técnicas de laboratorio
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {["Miño Cinthia", "Sandoval Milagros Adriana"].map((label) => (
              <div
                key={label}
                className="bg-white rounded-xl shadow p-6 text-center"
              >
                <FaFlask className="text-[#A63A3A] text-4xl mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800">
                  {label}
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Encargada de la recepción, procesamiento y preparación
                  de muestras según protocolos establecidos.
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
