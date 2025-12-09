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

        {/* Wrapper centrado */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content
            className="
              w-full max-w-sm bg-white p-6 rounded-xl shadow-xl outline-none
              data-[state=open]:animate-scale-in
              data-[state=closed]:animate-scale-out
            "
          >
            <Dialog.Title className="text-xl font-semibold mb-2">
              {title}
            </Dialog.Title>

            <Dialog.Description className="text-gray-600 mb-6">
              {message}
            </Dialog.Description>

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
        </div>

      </Dialog.Portal>
    </Dialog.Root>
  );
}
