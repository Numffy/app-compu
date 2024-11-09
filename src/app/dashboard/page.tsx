"use client";

import React, { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, DollarSign, ChevronRight, Clock, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface JobOffer {
  id: string;
  publication_date: string;
  title: string;
  description: string;
  salary: string;
  companyId: string;
  typeOfcontract: string;
  schedule: string;
  modality: string;
  requeriments: string;
  experience: string;
}

export default function CompuTrabajoHome() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobOffers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://172.21.234.224:3001/api/oferts');
        if (!response.ok) {
          throw new Error('Failed to fetch job offers');
        }
        const data = await response.json();
        setJobOffers(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching job offers:', error);
        setError('Error al cargar las ofertas de trabajo. Por favor, intente nuevamente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobOffers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CompuTrabajo</h1>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Buscar empleos</a></li>
              <li><a href="#" className="hover:underline">Empresas</a></li>
              <li><a href="#" className="hover:underline">Publicar empleo</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Encuentra el trabajo de tus sueños</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input type="text" placeholder="¿Qué trabajo buscas?" className="flex-grow" />
            <Input type="text" placeholder="¿Dónde?" className="sm:w-1/3" />
            <Button type="submit" className="bg-blue-600 text-white">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Ofertas de trabajo destacadas</h3>
          {isLoading ? (
            <div className="text-center py-10">Cargando ofertas de trabajo...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : (
            <div className="space-y-4">
              {jobOffers.map((job) => (
                <div key={job.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg text-blue-600">{job.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.modality}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Publicado el {new Date(job.publication_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.schedule}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      {job.experience}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.typeOfcontract}</Badge>
                    {job.requeriments.split(',').map((req, index) => (
                      <Badge key={index} variant="outline">{req.trim()}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Button variant="outline" className="px-8">Ver más ofertas</Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Sobre CompuTrabajo</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Quiénes somos</a></li>
                <li><a href="#" className="hover:underline">Prensa</a></li>
                <li><a href="#" className="hover:underline">Contáctanos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Para candidatos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Buscar empleos</a></li>
                <li><a href="#" className="hover:underline">Consejos</a></li>
                <li><a href="#" className="hover:underline">Crear CV</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Para empresas</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Publicar empleo</a></li>
                <li><a href="#" className="hover:underline">Buscar candidatos</a></li>
                <li><a href="#" className="hover:underline">Precios</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CompuTrabajo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}