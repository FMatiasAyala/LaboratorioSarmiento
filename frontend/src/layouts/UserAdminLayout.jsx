import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/Portal/Sidebar"

export default function UserAdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
