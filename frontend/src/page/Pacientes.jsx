import React from "react"
import {
  FaFileMedical,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa"

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL

export default function Pacientes() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Información para pacientes
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Desde aquí podrás acceder a tus resultados de laboratorio,
            conocer los tiempos de entrega y obtener información importante
            sobre los estudios.
          </p>
        </header>

        {/* PORTAL */}
        <div className="bg-white rounded-xl shadow p-8 mb-12 text-center">
          <FaFileMedical className="text-[#A63A3A] text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-3">
            Portal de resultados
          </h2>
          <p className="text-gray-700 mb-6">
            Accedé de forma segura a tus resultados desde cualquier dispositivo.
          </p>

          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#A63A3A] hover:bg-[#8F2F2F] text-white
                       font-semibold px-8 py-3 rounded-full transition"
          >
            Ingresar al portal
          </a>
        </div>

        {/* CÓMO BUSCAR */}
        <div className="bg-white rounded-xl shadow p-8 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <FaSearch className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              ¿Cómo buscar tus resultados?
            </h2>
          </div>

          <ul className="space-y-3 text-gray-700">
            <li>• Número de ingreso</li>
            <li>• DNI</li>
            <li>• Nombre completo</li>
          </ul>

          <p className="text-gray-600 mt-4 text-sm">
            Al ingresar al laboratorio se genera un número de ingreso
            asociado a cada paciente.
          </p>
        </div>

        {/* ESTADOS */}
        <div className="bg-white rounded-xl shadow p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <FaCheckCircle className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Estados de los estudios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <FaClock className="text-[#A63A3A] text-3xl mx-auto mb-2" />
              <h3 className="font-semibold">En proceso</h3>
              <p className="text-sm text-gray-700">
                El estudio se encuentra en análisis.
              </p>
            </div>

            <div>
              <FaFileMedical className="text-[#A63A3A] text-3xl mx-auto mb-2" />
              <h3 className="font-semibold">Con resultado</h3>
              <p className="text-sm text-gray-700">
                El estudio ya cuenta con resultados.
              </p>
            </div>

            <div>
              <FaCheckCircle className="text-[#A63A3A] text-3xl mx-auto mb-2" />
              <h3 className="font-semibold">Validado</h3>
              <p className="text-sm text-gray-700">
                Resultado validado y disponible.
              </p>
            </div>
          </div>
        </div>

        {/* TIEMPOS */}
        <div className="bg-white rounded-xl shadow p-8 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <FaClock className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Tiempos de entrega
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            El tiempo de entrega varía según el estudio solicitado.
            Cada análisis tiene configurado su propio plazo.
            En algunos casos, los resultados pueden entregarse de manera
            parcial sin esperar la finalización de todos los estudios.
          </p>
        </div>

        {/* PREPARACIONES */}
        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex items-center gap-4 mb-4">
            <FaClipboardList className="text-[#A63A3A] text-3xl" />
            <h2 className="text-2xl font-semibold">
              Preparaciones para estudios
            </h2>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Las preparaciones varían según el pedido médico.
            Al momento de realizar el estudio, el personal del laboratorio
            indicará si es necesaria alguna preparación previa.
          </p>
        </div>

      </div>
    </section>
  )
}
