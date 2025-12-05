import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Mantener sincronizado con localStorage
  useEffect(() => {
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    else localStorage.removeItem("usuario");
  }, [usuario]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // -------------- FUNCIONES GLOBALES --------------
  const login = (user, jwt) => {
    setUsuario(user);
    setToken(jwt);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        rol: usuario?.rol || null,
        isLogged: !!usuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
