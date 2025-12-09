export default function LoadingModal({ open, mensaje = "Procesando..." }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="loading-card">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#A63A3A] rounded-full animate-spin"></div>

        {/* Texto */}
        <p className="text-gray-700 font-medium">{mensaje}</p>
      </div>
    </div>
  );
}
