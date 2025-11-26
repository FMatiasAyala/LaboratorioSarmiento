import React, { useState } from "react"

const faqs = [
  {
    pregunta: "¿Debo sacar turno para realizarme un análisis?",
    respuesta:
      "Para la mayoría de los análisis de rutina no es necesario sacar turno previo. Sin embargo, algunos estudios especiales requieren preparación o coordinación, por lo que recomendamos consultar previamente.",
  },
  {
    pregunta: "¿Cuántas horas de ayuno debo tener?",
    respuesta:
      "Generalmente se recomienda un ayuno de entre 8 y 12 horas antes de realizar análisis de sangre. Solo se puede beber agua. No se debe consumir café, mate, ni fumar durante ese período.",
  },
  {
    pregunta: "¿Puedo tomar mis medicamentos antes de la extracción?",
    respuesta:
      "Depende del tipo de medicación. En la mayoría de los casos se recomienda tomarla luego de la extracción. Ante dudas, consultá con tu médico o con nuestro personal antes del estudio.",
  },
  {
    pregunta: "¿Cuándo estarán disponibles mis resultados?",
    respuesta:
      "Los resultados de análisis de rutina suelen estar disponibles dentro de las 24 a 48 horas hábiles. Podrás consultarlos desde el Portal de Pacientes o retirarlos personalmente.",
  },
  {
    pregunta: "¿Cómo ingreso al portal para ver mis resultados?",
    respuesta:
      "Accedé al Portal de Pacientes desde la página principal e ingresá tu DNI y contraseña. Si no tenés usuario, podés solicitarlo en recepción al momento de la extracción.",
  },
  {
    pregunta: "¿Dónde se encuentra el laboratorio?",
    respuesta:
      "Nos ubicamos en Calle Sarmiento 1234, Ciudad. Nuestro horario de atención es de lunes a viernes de 7:00 a 18:00 y sábados de 7:00 a 12:00.",
  },
  {
    pregunta: "¿Atienden con obras sociales y prepagas?",
    respuesta:
      "Sí, trabajamos con la mayoría de las obras sociales y prepagas. Podés consultar el listado actualizado en la recepción o por teléfono.",
  },
  {
    pregunta: "¿Puedo autorizar a otra persona a retirar mis resultados?",
    respuesta:
      "Sí, siempre que presente la orden y una autorización firmada junto con el DNI del paciente y de la persona autorizada.",
  },
  {
    pregunta: "¿Qué debo hacer si necesito repetir un estudio?",
    respuesta:
      "En caso de necesitar repetir un análisis, comunicate con nosotros. Si fue indicado por el laboratorio, la repetición no tiene costo adicional.",
  },
]

export default function PreguntasFrecuentes() {
  const [abierta, setAbierta] = useState(null)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl font-bold text-[#A63A3A] mb-8 text-center">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <button
                onClick={() => setAbierta(abierta === index ? null : index)}
                className="w-full text-left px-5 py-4 flex justify-between items-center font-semibold text-gray-800 hover:text-[#A63A3A] transition"
              >
                {item.pregunta}
                <span className="text-[#A63A3A] text-xl">
                  {abierta === index ? "–" : "+"}
                </span>
              </button>

              {abierta === index && (
                <div className="px-5 pb-4 text-gray-600 border-t border-gray-100">
                  {item.respuesta}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
