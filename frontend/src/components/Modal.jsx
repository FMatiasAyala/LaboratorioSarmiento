export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        
        <h2 className="text-xl font-semibold text-[#A63A3A] mb-4 text-center">
          {title}
        </h2>

        <div>{children}</div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
