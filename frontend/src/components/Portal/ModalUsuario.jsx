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

                {/* WRAPPER CENTRADO (SOLUCIONA EL PROBLEMA) */}
                <div className="fixed inset-0 flex items-center justify-center p-4">

                    <Dialog.Content
                        aria-describedby={undefined}
                        className="
              w-full max-w-xl rounded-xl bg-white p-6 shadow-xl outline-none
              data-[state=open]:animate-scale-in
              data-[state=closed]:animate-scale-out
            "
                    >
                        {/* TOASTER */}
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

                        {/* CONTENIDO */}
                        {children}
                    </Dialog.Content>

                </div>

            </Dialog.Portal>
        </Dialog.Root>
    );
}
