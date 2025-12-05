import * as Dialog from "@radix-ui/react-dialog";

export default function ModalUsuario({ open, onClose, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>

        {/* Fondo opaco */}
        <Dialog.Overlay
          className="
            fixed inset-0 bg-black/40 backdrop-blur-sm
            data-[state=open]:animate-fade-in
            data-[state=closed]:animate-fade-out
          "
        />

        {/* Contenido centrado */}
        <Dialog.Content
          className="
            fixed top-1/2 left-1/2 w-full max-w-xl
            -translate-x-1/2 -translate-y-1/2
            rounded-xl bg-white p-6 shadow-xl
            data-[state=open]:animate-scale-in
            data-[state=closed]:animate-scale-out
          "
        >
          {children}
        </Dialog.Content>

      </Dialog.Portal>
    </Dialog.Root>
  );
}
