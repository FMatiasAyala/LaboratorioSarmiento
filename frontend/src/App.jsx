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

  const rol = usuario?.rol;

  return (
    <Suspense>
      <Routes>

        {/* --- PUBLICA --- */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="inicio" element={<Home />} />
          <Route path="pacientes/preguntas" element={<PreguntasFrecuentes />} />
        </Route>

        {/* LOGIN */}
        <Route path="/portal/login" element={<Login />} />

        {/* RUTAS PROTEGIDAS */}
        <Route
          path="/portal/*"
          element={
            !usuario
              ? <Navigate to="/portal/login" />
              : rol === "admin"
                ? <UserAdminLayout />
                : rol === "paciente"
                  ? <PortalLayout />
                  : <Navigate to="/portal/login" />   // rol desconocido
          }
        >
          {/* PACIENTE */}
          <Route path="resultados" element={<Resultados />} />

          {/* ADMIN */}
          <Route path="usuarios" element={<UsuariosList />} />

          {/* REDIRECT según rol */}
          <Route
            index
            element={
              rol === "admin"
                ? <Navigate to="usuarios" />
                : <Navigate to="resultados" />
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  );
}


