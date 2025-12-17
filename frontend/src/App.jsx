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
import UsuariosList from "./page/Portal/UsuariosList";
import Perfil from "./page/Portal/Perfil";

import AutoRegistroInicio from "./auth/AutoRegistroInicio";
import AutoRegistroConfirmar from "./auth/AutoRegistroConfirmar";
import Servicios from "./page/Servicios";
import AnalisisClinicos from "./page/AnalisisClinicos";
import DiagnosticoPatologias from "./page/DiagnosticoPatologias";
import Nosotros from "./page/Nosotros";
import Instalaciones from "./page/Instalaciones";
import Contacto from "./page/Contacto";
import Equipo from "./page/Equipo";
import Pacientes from "./page/Pacientes";

export default function App() {
  const { usuario, rol, isLogged } = useAuth();

  return (
    <Suspense>
      <Routes>

        {/* PUBLICA */}
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="inicio" element={<Home />} />
          <Route path="servicios" element={<Servicios
           />} />
          <Route path="servicios/analisis-clinicos" element={<AnalisisClinicos />} />
          <Route path="servicios/diagnostico-patologias" element={<DiagnosticoPatologias />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="nosotros/equipo" element={<Equipo />} />
          <Route path="nosotros/instalaciones" element={<Instalaciones />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="pacientes" element={<Pacientes />} />

        </Route>

        <Route path="/portal/login" element={<Login />} />
        <Route path="autoregistro" element={<AutoRegistroInicio />} />
        <Route path="registro/verificar/:idPublico" element={<AutoRegistroConfirmar />} />

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
          <Route path="perfil" element={<Perfil />} />

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
