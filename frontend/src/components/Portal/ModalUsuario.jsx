import * as Dialog from "@radix-ui/react-dialog";
import { Toaster } from "react-hot-toast";
export default function ModalUsuario({ open, onClose, children, title = "Modal" }) {
    return (
        <Dialog.Root open={open} onOpenChange={onClose}>
            <Dialog.Portal>

                {/* FONDO OSCURO */}
                <Dialog.Overlay
                    className="
            fixed inset-0 bg-black/40 backdrop-blur-sm
            data-[state=open]:animate-fade-in
            data-[state=closed]:animate-fade-out
          "
                />
                {/* CONTENIDO */}
                <Dialog.Content
                    aria-describedby={undefined}
                    className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-full max-w-xl rounded-xl bg-white p-6 shadow-xl
            data-[state=open]:animate-scale-in
            data-[state=closed]:animate-scale-out
          "
                >
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            duration: 3000,
                            style: { fontSize: "15px" },
                        }}
                    />
                    {/* REQUERIDO POR RADIX */}
                    <Dialog.Title className="text-xl font-bold mb-4">
                        {title}
                    </Dialog.Title>

                    {/* TU CONTENIDO */}
                    {children}
                </Dialog.Content>

            </Dialog.Portal>
        </Dialog.Root>
    );
}
