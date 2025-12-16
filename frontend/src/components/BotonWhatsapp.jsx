import { FaWhatsapp } from "react-icons/fa"

export default function BotonWhatsapp() {
  return (
    <div className="fixed bottom-5 right-5 z-50 group">
      {/* Botón principal */}
      <a
        href="https://wa.me/5493624532252" // reemplazá por tu número
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform duration-300 hover:scale-110"
      >
        <FaWhatsapp className="w-7 h-7" />
      </a>

      {/* Burbuja flotante al hover */}
      <span className="absolute right-16 bottom-3 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-full shadow-md whitespace-nowrap transition-all duration-300 transform translate-y-1/2 group-hover:translate-y-0">
        Comunicate con nosotros!
      </span>
    </div>
  )
}
