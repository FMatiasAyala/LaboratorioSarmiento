import React from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../components/NavBar"
import Footer from "../components/Footer"
import BotonWhatsapp from "../components/BotonWhatsapp"

function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] bg-gray-50 text-gray-800">
        <Outlet />
      </main>
      <BotonWhatsapp/>
      <Footer />
    </>
  )
}

export default AppLayout
