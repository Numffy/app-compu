"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  salary: z.string().min(1, 'El salario es requerido'),
  typeOfcontract: z.string().min(1, 'El tipo de contrato es requerido'),
  schedule: z.string().min(1, 'El horario es requerido'),
  modality: z.string().min(1, 'La modalidad es requerida'),
  requeriments: z.string().min(1, 'Los requisitos son requeridos'),
  experience: z.string().min(1, 'La experiencia requerida es necesaria'),
})

export default function CreateJobOffer() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      salary: '',
      typeOfcontract: '',
      schedule: '',
      modality: '',
      requeriments: '',
      experience: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    console.log(values)
    try {
      const response = await fetch('http://172.21.234.224:3001/api/oferts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to create job offer')
      }

      const data = await response.json()
      toast({
        title: "Oferta creada con éxito",
        description: "La oferta de trabajo ha sido publicada correctamente.",
      })
      form.reset()
    } catch (error) {
      console.error('Error creating job offer:', error)
      toast({
        title: "Error",
        description: "Hubo un problema al crear la oferta de trabajo. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Crear Nueva Oferta de Trabajo</CardTitle>
        <CardDescription className="text-center">
          Complete los detalles de la nueva oferta de trabajo para atraer a los mejores candidatos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del puesto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Desarrollador Full Stack Senior" {...field} />
                  </FormControl>
                  <FormDescription>
                    Ingrese un título claro y conciso que describa el puesto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del puesto</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describa las responsabilidades, tareas y objetivos del puesto..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Proporcione una descripción detallada de las responsabilidades y expectativas del puesto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salario</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: $50,000 - $70,000 anual" {...field} />
                  </FormControl>
                  <FormDescription>
                    Especifique el rango salarial o la compensación ofrecida.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeOfcontract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Contrato</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de contrato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full-time">Tiempo Completo</SelectItem>
                      <SelectItem value="part-time">Medio Tiempo</SelectItem>
                      <SelectItem value="contract">Contrato</SelectItem>
                      <SelectItem value="internship">Pasantía</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Indique el tipo de contrato para esta posición.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horario</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Lunes a Viernes, 9am - 6pm" {...field} />
                  </FormControl>
                  <FormDescription>
                    Especifique el horario de trabajo esperado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione la modalidad de trabajo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="presencial">Presencial</SelectItem>
                      <SelectItem value="remoto">Remoto</SelectItem>
                      <SelectItem value="hibrido">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Indique la modalidad de trabajo para esta posición.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requeriments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requisitos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Liste los requisitos y habilidades necesarias para el puesto..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enumere los requisitos específicos, habilidades y cualificaciones necesarias para el puesto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiencia Requerida</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 3+ años de experiencia en desarrollo web" {...field} />
                  </FormControl>
                  <FormDescription>
                    Especifique la experiencia mínima requerida para el puesto.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          type="submit"
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando oferta...
            </>
          ) : (
            'Publicar Oferta de Trabajo'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}