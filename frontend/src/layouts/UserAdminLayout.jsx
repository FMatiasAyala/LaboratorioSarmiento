import React from "react"
import { Outlet } from "react-router-dom"

export default function UserAdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
