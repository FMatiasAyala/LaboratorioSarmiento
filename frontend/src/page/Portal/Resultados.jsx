import { useEffect, useState } from "react";
import { FaVial, FaCalendar, FaPhone, FaUserMd, FaFileAlt, FaTimes, FaFilePdf } from "react-icons/fa";


const API_URL = import.meta.env.VITE_API_URL;

export default function Resultados() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const token = localStorage.token;
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para modal
  const [modalOpen, setModalOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  //Modal PDF
  const [modalPdf, setModalPdf] = useState(false);
  const [modalPdfLoading, setModalPdfLoading] = useState(false);
  const [modalPdfError, setModalPdfError] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);


  // ========================
  // CARGA DE INGRESOS
  // ========================
  useEffect(() => {
    if (!usuario?.nro_historia) {
      setError("No se encontró el número de historia del paciente.");
      setLoading(false);
      return;
    }

    if (!token) {
      return;
    }

    const fetchResultados = async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await fetch(
          `${API_URL}/api/resultados/${usuario.nro_historia}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await resp.json();

        if (!resp.ok) {
          throw new Error(data.error || "Error al consultar resultados");
        }

        if (!data.resultados?.ok) {
          throw new Error("El laboratorio no devolvió resultados válidos");
        }

        setIngresos(data.resultados.ingresos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [usuario?.nro_historia, token]);


  // ========================
  // CARGAR DETALLE DE UN INGRESO
  // ========================
  const abrirDetalle = async (ingreso) => {
    try {
      setModalOpen(true);
      setLoadingDetalle(true);
      setDetalle(null);

      const resp = await fetch(`${API_URL}/api/detalles/${ingreso}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      const data = await resp.json();

      console.log("DETALLE:", data);

      // 🔥 CORRECCIÓN: el detalle viene dentro de un array
      setDetalle(data.resultados?.detalles?.[0] || null);

    } catch (err) {
      setDetalle({ error: err.message });
    } finally {
      setLoadingDetalle(false);
    }
  };
  const descargarPDF = async (ingreso) => {
    const token = localStorage.token;

    setModalPdf(true);
    setModalPdfLoading(true);
    setModalPdfError("");
    setPdfUrl(null);

    try {
      const resp = await fetch(`${API_URL}/api/pdf-url/${ingreso}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      setModalPdfLoading(false);

      if (!resp.ok || !data.ok) {
        setModalPdfError(data.error || "No se encontró el PDF del estudio.");
        return;
      }

      // Guardamos la URL segura para mostrar el visor
      setPdfUrl(data.url);

    } catch (err) {
      setModalPdfLoading(false);
      setModalPdfError("Error al comunicarse con el servidor.");
    }
  };




  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-[#A63A3A]">
        Bienvenido, {usuario?.nombre}
      </h1>

      <p className="text-gray-700 mb-6">
        Aquí verás el estado de tus ingresos de laboratorio.
      </p>

      {/* Loader / Error / Vacío */}
      {loading && <p className="text-gray-600">Cargando resultados...</p>}
      {!loading && error && <p className="text-red-600">{error}</p>}
      {!loading && !error && ingresos.length === 0 && (
        <p className="text-gray-600">
          Por el momento no se encontraron ingresos para tu cuenta.
        </p>
      )}

      {/* TABLA */}
      {!loading && !error && ingresos.length > 0 && (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 py-2">Fecha</th>
                <th className="text-left px-4 py-2">N.º de ingreso</th>
                <th className="text-left px-4 py-2">Estado</th>
                <th className="text-left px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((item) => (
                <tr key={item.ingreso} className="border-b last:border-0">
                  <td className="px-4 py-2">{item.fecha ? item.fecha.split("T")[0] : "—"}</td>
                  <td className="px-4 py-2">{item.ingreso}</td>
                  <td className="px-4 py-2">
                    {item.estado_nombre ? item.estado_nombre.trim() : item.estado}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => abrirDetalle(item.ingreso)}
                      className="text-[#A63A3A] underline"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-3 border-t text-right text-xs text-gray-500">
            Se encontraron {ingresos.length} ingresos.
          </div>
        </div>
      )}

      {/* ======================== */}
      {/* MODAL DE DETALLE         */}
      {/* ======================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-lg p-7 rounded-2xl shadow-xl border border-gray-200 relative animate-fadeIn">

            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
            >
              <FaTimes size={18} />
            </button>

            {/* TÍTULO */}
            <h2 className="text-2xl font-bold mb-6 text-[#A63A3A] flex items-center gap-2">
              <FaVial /> Detalle del estudio
            </h2>

            {/* LOADING */}
            {loadingDetalle && (
              <p className="text-gray-600 text-center py-4">Cargando información...</p>
            )}

            {/* CONTENIDO */}
            {!loadingDetalle && detalle && !detalle.error && (
              <div className="space-y-4 text-sm">

                {/* INGRESO */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaFileAlt className="text-[#A63A3A]" /> Ingreso
                  </p>
                  <p className="text-gray-800">{detalle.ingreso}</p>
                </div>

                {/* FECHA NACIMIENTO */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaCalendar className="text-[#A63A3A]" /> Fecha de nacimiento
                  </p>
                  <p>{detalle.fechanac ? detalle.fechanac.split("T")[0] : "—"}</p>
                </div>

                {/* TELÉFONO */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaPhone className="text-[#A63A3A]" /> Teléfono
                  </p>
                  <p>{detalle.telefono?.trim() || "—"}</p>
                </div>

                {/* OBRA SOCIAL */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaUserMd className="text-[#A63A3A]" /> Obra social
                  </p>
                  <p>{detalle.obrasocial?.trim() || "Particular"}</p>
                </div>

                {/* DERIVADO */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaUserMd className="text-[#A63A3A]" /> Derivado por
                  </p>
                  <p>{detalle.nomderiv?.trim() || "—"}</p>
                </div>

                {/* OBSERVACIONES DEL INGRESO */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-line">
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaFileAlt className="text-[#A63A3A]" /> Observaciones del ingreso
                  </p>
                  <p>{detalle.observai?.trim() || "—"}</p>
                </div>

                {/* OBSERVACIONES DEL PACIENTE */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-line">
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <FaFileAlt className="text-[#A63A3A]" /> Observaciones del paciente
                  </p>
                  <p>{detalle.observap?.trim() || "—"}</p>
                </div>
                {/* BOTÓN DESCARGAR PDF */}
                <div className="mt-6 text-right">
                  <button
                    onClick={() => descargarPDF(detalle.ingreso)}
                    className="flex items-center gap-2 bg-[#A63A3A] hover:bg-[#8F2F2F] text-white px-4 py-2 rounded-lg shadow transition mx-auto"
                  >
                    <FaFilePdf size={18} />
                    Descargar PDF
                  </button>
                </div>

              </div>
            )}

            {/* ERROR */}
            {!loadingDetalle && detalle?.error && (
              <p className="text-red-600">{detalle.error}</p>
            )}
          </div>

        </div>
      )}

      
      {modalPdf && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl border border-gray-200 relative animate-fadeIn">

            {/* BOTÓN CERRAR */}
            <button
              onClick={() => {
                setModalPdf(false);
                setPdfUrl(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>

            {/* ========= ESTADO: CARGANDO PDF ========= */}
            {modalPdfLoading && (
              <div className="text-center py-10">
                <h2 className="text-xl font-bold text-[#A63A3A] mb-4">Generando PDF…</h2>

                <div className="flex justify-center py-4">
                  <div className="w-12 h-12 border-4 border-[#A63A3A] border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* ========= ESTADO: ERROR ========= */}
            {!modalPdfLoading && modalPdfError && (
              <div className="text-center py-8">
                <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
                <p className="text-gray-700 mb-4">{modalPdfError}</p>

                <button
                  onClick={() => setModalPdf(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            )}

            {/* ========= ESTADO: PDF LISTO (VISOR) ========= */}
            {!modalPdfLoading && pdfUrl && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-[#A63A3A]">
                  Vista previa del estudio
                </h2>

                {/* VISOR PDF */}
                <iframe
                  src={pdfUrl}
                  className="w-full h-[70vh] border rounded-lg shadow-inner"
                  title="Visor PDF"
                ></iframe>

                {/* BOTONES */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => window.open(pdfUrl, "_blank")}
                    className="bg-[#A63A3A] hover:bg-[#8F2F2F] text-white px-4 py-2 rounded-lg shadow"
                  >
                    Abrir en pestaña nueva
                  </button>

                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = pdfUrl;
                      a.download = `estudio-${Date.now()}.pdf`;
                      a.click();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Descargar PDF
                  </button>

                  <button
                    onClick={() => {
                      setModalPdf(false);
                      setPdfUrl(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}


    </div>
  );
}
