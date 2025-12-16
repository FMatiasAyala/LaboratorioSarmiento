import React from "react"
import Ubicacion from "../components/Ubicacion"
import { FaPhoneAlt, FaEnvelope, FaInfoCircle } from "react-icons/fa"

export default function Contacto() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-[#A63A3A] mb-4">
            Contacto
          </h1>
          <p className="text-gray-700 text-lg">
            Podés comunicarte con nosotros ante cualquier consulta.
          </p>
        </header>

        {/* INFO RÁPIDA */}
        <div className="bg-white rounded-xl shadow p-8 mb-12">
          <div className="grid md:grid-cols-3 gap-6">

            <div className="flex items-start gap-3">
              <FaPhoneAlt className="text-[#A63A3A] text-xl mt-1" />
              <p className="text-gray-700">
                <strong>WhatsApp</strong><br />
                362 453-2252
              </p>
            </div>

            <div className="flex items-start gap-3">
              <FaEnvelope className="text-[#A63A3A] text-xl mt-1" />
              <p className="text-gray-700">
                <strong>Email</strong><br />
                laboratoriosarmientola@gmail.com
              </p>
            </div>

            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-[#A63A3A] text-xl mt-1" />
              <p className="text-gray-700">
                <strong>Horarios</strong><br />
                Lun a Vie<br />
                7:00–12:30 / 17:00–20:00
              </p>
            </div>

          </div>
        </div>

        {/* MAPA + DIRECCIÓN */}
        <Ubicacion />

      </div>
    </section>
  )
}
