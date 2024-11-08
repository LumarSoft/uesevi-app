'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { GhostIcon, HomeIcon } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    const redirect = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <div className="text-center space-y-8">
        <GhostIcon className="w-32 h-32 mx-auto animate-bounce text-purple-600" />
        <h1 className="text-8xl font-bold text-purple-600">404</h1>
        <h2 className="text-4xl font-semibold">Página no encontrada</h2>
        <p className="text-xl text-gray-600">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <p className="text-lg text-gray-500">
          Redirigiendo al inicio en <span className="font-bold text-purple-600">{countdown}</span> segundos...
        </p>
        <Button 
          onClick={() => router.push('/')}
          className="bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Ir al inicio ahora
        </Button>
      </div>
    </div>
  )
}