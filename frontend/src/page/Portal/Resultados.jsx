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


      // 🔥 CORRECCIÓN: el detalle viene dentro de un array
      setDetalle(data.detalles?.resultados?.detalles?.[0] || null);

    } catch (err) {
      setDetalle({ error: err.message });
    } finally {
      setLoadingDetalle(false);
    }
  };
  const descargarPDF = async (ingreso) => {
    setModalPdf(true);
    setModalPdfLoading(true);
    setModalPdfError("");

    try {
      const resp = await fetch(`${API_URL}/api/pdf-url/${ingreso}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();
      setModalPdfLoading(false);

      if (!resp.ok || !data.ok) {
        setModalPdfError(
          data.error || "El resultado aún no está disponible."
        );
        return;
      }

      // ✅ PDF válido
      setModalPdf(false);

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        window.location.href = data.url;
      } else {
        window.open(data.url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setModalPdfLoading(false);
      setModalPdfError("No se pudo descargar el estudio.");
    }
  };





  return (
    <div className="w-full">
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
        <>
          {/* ===== MOBILE ===== */}
          < div className="space-y-4 md:hidden">
            {ingresos.map((item) => (
              <div
                key={item.ingreso}
                className="bg-white border rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Ingreso #{item.ingreso}
                    </p>
                    <p className="text-sm text-gray-600">
                      Fecha: {item.fecha ? item.fecha.split("T")[0] : "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Estado: {item.estado_nombre?.trim() || item.estado}
                    </p>
                  </div>

                  <button
                    onClick={() => abrirDetalle(item.ingreso)}
                    className="text-[#A63A3A] underline text-sm"
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ===== DESKTOP ===== */}
          <div className="hidden md:block overflow-x-auto bg-white shadow rounded-lg">
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
                    <td className="px-4 py-2">
                      {item.fecha ? item.fecha.split("T")[0] : "—"}
                    </td>
                    <td className="px-4 py-2">{item.ingreso}</td>
                    <td className="px-4 py-2">
                      {item.estado_nombre?.trim() || item.estado}
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
          </div>
        </>
      )
      }

      {/* ======================== */}
      {/* MODAL DE DETALLE         */}
      {/* ======================== */}
      {
        modalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-xl border border-gray-200 relative animate-fadeIn">

              {/* BOTÓN CERRAR */}
              <button
                onClick={() => setModalOpen(false)}
                className="sticky top-0 float-right text-gray-400 hover:text-gray-700 transition bg-white rounded-full p-1"
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
        )
      }
      {/* ======================== */}
      {/* MODAL DESCARGA DE PDF    */}
      {/* ======================== */}
      {
        modalPdf && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl border border-gray-200 relative animate-fadeIn">

              {/* TÍTULO */}
              <h2 className="text-xl font-bold mb-4 text-[#A63A3A] text-center">
                Generando PDF…
              </h2>

              {/* SPINNER */}
              {modalPdfLoading && (
                <div className="flex justify-center py-4">
                  <div className="w-10 h-10 border-4 border-[#A63A3A] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* ERROR */}
              {!modalPdfLoading && modalPdfError && (
                <>
                  <p className="text-red-600 text-center mb-4">{modalPdfError}</p>

                  <button
                    onClick={() => setModalPdf(false)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg"
                  >
                    Cerrar
                  </button>
                </>
              )}

              {/* CANCELAR (solo mientras carga) */}
              {modalPdfLoading && (
                <button
                  onClick={() => setModalPdf(false)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg mt-4"
                >
                  Cancelar
                </button>
              )}
            </div>

          </div>
        )
      }

    </div >
  );
}
