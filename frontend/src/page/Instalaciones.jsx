import React from "react"
import { FaHospital, FaMicroscope, FaVials } from "react-icons/fa"

export default function Instalaciones() {
  // simulamos array de fotos (después podés traerlas de una API)
  const fotos = [
    "/instalaciones/inst1.jpg",
    "/instalaciones/inst2.jpg",
    "/instalaciones/inst3.jpg",
    "/instalaciones/inst4.jpg",
    "/instalaciones/inst5.jpg",
    "/instalaciones/inst6.jpg",
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Instalaciones
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Contamos con instalaciones equipadas para garantizar
            la correcta recepción, procesamiento y control de las muestras,
            manteniendo condiciones óptimas de higiene y seguridad.
          </p>
        </header>

        {/* BLOQUE DESCRIPTIVO */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <FaHospital className="text-[#A63A3A] text-4xl mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Área de atención</h3>
            <p className="text-gray-700 text-sm">
              Espacios preparados para una atención cómoda y ordenada
              de los pacientes.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <FaMicroscope className="text-[#A63A3A] text-4xl mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Área técnica</h3>
            <p className="text-gray-700 text-sm">
              Sectores destinados al procesamiento y análisis de muestras,
              siguiendo protocolos bioquímicos.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <FaVials className="text-[#A63A3A] text-4xl mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Control y validación</h3>
            <p className="text-gray-700 text-sm">
              Espacios dedicados al control y validación manual de resultados.
            </p>
          </div>
        </div>

        {/* GALERÍA */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {fotos.map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl shadow group"
            >
              <img
                src={src}
                alt={`Instalaciones ${i + 1}`}
                className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
