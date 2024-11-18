"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft } from 'lucide-react'

interface CompanyLoginProps {
  onBack: () => void
}

export default function CompanyLogin({ onBack }: CompanyLoginProps) {
  const [companyId, setCompanyId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Replace this with your actual company login API call
      const response = await fetch('http://your-api-url/company-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      // If login is successful, redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Iniciar sesión como Empresa</CardTitle>
        <CardDescription>Ingresa las credenciales de tu empresa para acceder</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyId">ID de Empresa</Label>
            <Input
              id="companyId"
              type="text"
              placeholder="ID de tu empresa"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </CardFooter>
    </Card>
  )
}