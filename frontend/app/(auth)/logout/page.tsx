"use client"

import { useState } from "react"
import { logout } from "@/services/auth"

export default function LogoutPage() {
  const [msg, setMsg] = useState<string | null>(null)
  const handleLogout = async () => {
    const res = await logout()
    setMsg(res.message)
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Sair
      </button>
      {msg && <p className="mt-2">{msg}</p>}
    </div>
  )
}
