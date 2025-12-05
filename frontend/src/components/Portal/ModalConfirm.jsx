import * as Dialog from "@radix-ui/react-dialog";

export default function ModalConfirm({ open, onClose, title, message, onConfirm }) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>

        {/* Fondo */}
        <Dialog.Overlay
          className="
            fixed inset-0 bg-black/40 backdrop-blur-sm
            data-[state=open]:animate-fade-in
            data-[state=closed]:animate-fade-out
          "
        />

        {/* Cuadro */}
        <Dialog.Content
          className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-full max-w-sm bg-white p-6 rounded-xl shadow-xl
            data-[state=open]:animate-scale-in
            data-[state=closed]:animate-scale-out
          "
        >
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => onClose(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            >
              Cancelar
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose(false);
              }}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            >
              Eliminar
            </button>
          </div>
        </Dialog.Content>

      </Dialog.Portal>
    </Dialog.Root>
  );
}
