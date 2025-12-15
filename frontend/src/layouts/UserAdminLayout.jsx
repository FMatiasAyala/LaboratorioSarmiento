import { useState } from "react";
import Sidebar from "../components/Portal/Sidebar";
import PortalNavbar from "../components/Portal/PortalNavbar";
import { Outlet } from "react-router-dom";

export default function UserAdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:block w-64 bg-[#A63A3A] text-white">
        <Sidebar />
      </aside>

      {/* SIDEBAR MOBILE */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-64 bg-[#A63A3A] text-white shadow-lg z-50">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col">
        {/* Header solo mobile */}
        <PortalNavbar onMenuClick={() => setOpen(true)} />

        {/* SCROLL SOLO ACÁ */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-6xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
