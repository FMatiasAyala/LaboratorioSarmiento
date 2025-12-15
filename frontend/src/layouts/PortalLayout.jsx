import { useState } from "react"
import Sidebar from "../components/Portal/Sidebar"
import PortalNavbar from "../components/Portal/PortalNavbar"
import { Outlet } from "react-router-dom"

export default function PortalLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:block w-64">
        <Sidebar />
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-64 bg-white shadow-lg z-50">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Header mobile */}
        <PortalNavbar onMenuClick={() => setOpen(true)} />

        <main className="flex-1 px-4 py-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
