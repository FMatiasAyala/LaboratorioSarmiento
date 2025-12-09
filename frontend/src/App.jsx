import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AppLayout from "./layouts/AppLayout";
import PortalLayout from "./layouts/PortalLayout";
import UserAdminLayout from "./layouts/UserAdminLayout";

import Home from "./page/Home";
import NotFound from "./page/NotFound";
import Login from "./auth/Login";
import Resultados from "./page/Portal/Resultados";
import PreguntasFrecuentes from "./page/FAQ";
import UsuariosList from "./page/Portal/UsuariosList";

export default function App() {
  const { usuario, rol, isLogged } = useAuth();

  return (
    <Suspense>
      <Routes>

        {/* PUBLICA */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="inicio" element={<Home />} />
          <Route path="pacientes/preguntas" element={<PreguntasFrecuentes />} />

        </Route>

        <Route path="/portal/login" element={<Login />} />
        {/* PROTEGIDA */}
        <Route
          path="/portal/*"
          element={
            !isLogged
              ? <Navigate to="/portal/login" />
              : rol === "admin"
                ? <UserAdminLayout />
                : <PortalLayout />
          }
        >

          {/* Paciente */}
          {rol === "paciente" && (
            <Route path="resultados" element={<Resultados />} />
          )}

          {/* Admin */}
          {rol === "admin" && (
            <Route path="usuarios" element={<UsuariosList />} />
          )}

          {/* Redirección por defecto */}
          <Route
            index
            element={
              rol === "admin"
                ? <Navigate to="usuarios" />
                : <Navigate to="resultados" />
            }
          />
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
