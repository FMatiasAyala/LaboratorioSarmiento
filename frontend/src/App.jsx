import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PortalLayout from "./layouts/PortalLayout";
import Home from "./page/Home";
import NotFound from "./page/NotFound";
import Login from "./auth/Login";
import Resultados from "./page/Portal/Resultados";
import PreguntasFrecuentes from "./page/FAQ";

function App() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  return (
    <Suspense>
      <Routes>
        {/* --- WEB PÚBLICA --- */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="inicio" element={<Home />} />
          <Route path="pacientes/preguntas" element={<PreguntasFrecuentes />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* --- PORTAL PACIENTE LOGIN --- */}
        <Route path="/portal/login" element={<Login />} />

        {/* --- PORTAL PACIENTE PROTEGIDO --- */}
        <Route
          path="/portal/*"
          element={usuario ? <PortalLayout /> : <Navigate to="/portal/login" />}
        >
          <Route index element={<Resultados />} />
        </Route>

        {/* --- 404 --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
