import { useState } from "react"
import Sidebar from "../components/Portal/Sidebar"
import PortalNavbar from "../components/Portal/PortalNavbar"
import { Outlet } from "react-router-dom"

export default function PortalLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar desktop */}
      <aside className="w-64 bg-[#A63A3A] text-white min-h-full">
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

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="max-w-4xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}
