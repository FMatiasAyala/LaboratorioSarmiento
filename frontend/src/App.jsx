import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import PortalLayout from "./layouts/PortalLayout";
import Home from "./page/Home";
import NotFound from "./page/NotFound";
import Login from "./auth/Login";
import Resultados from "./page/Portal/Resultados";
import PreguntasFrecuentes from "./page/FAQ";
import UserAdminLayout from "./layouts/UserAdminLayout";
import UsuariosList from "./page/Portal/UsuariosList";

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

        {/* --- LOGIN DEL PORTAL --- */}
        <Route path="/portal/login" element={<Login />} />

        {/* --- PORTAL PROTEGIDO (PACIENTE O ADMIN) --- */}
        <Route
          path="/portal/*"
          element={
            usuario
              ? usuario.rol === "admin"
                ? <UserAdminLayout />   // ADMIN
                : <PortalLayout />      // PACIENTE
              : <Navigate to="/portal/login" />
          }
        >
          {/* Paciente → resultados */}
          {usuario?.rol === "paciente" && (
            <Route index element={<Resultados />} />
          )}

          {/* Admin → lista de usuarios */}
          {usuario?.rol === "admin" && (
            <Route index element={<UsuariosList />} />
          )}
        </Route>

        {/* --- 404 FINAL --- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;

