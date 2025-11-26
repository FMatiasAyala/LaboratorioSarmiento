import Sidebar from "../components/Portal/Sidebar"
import { Outlet } from "react-router-dom"

export default function PortalLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
