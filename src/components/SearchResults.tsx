"use client";

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Briefcase, Calendar, DollarSign, ChevronRight, Clock, Award, ArrowLeft, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

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

export default function SearchResults() {
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';

  useEffect(() => {
    const fetchJobOffers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://172.21.234.224:3001/api/oferts');
        if (!response.ok) {
          throw new Error('Failed to fetch job offers');
        }
        const data = await response.json();
        const filteredData = data.filter((job: JobOffer) => 
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase()) ||
          job.modality.toLowerCase().includes(location.toLowerCase())
        );
        setJobOffers(filteredData);
        setError(null);
      } catch (error) {
        console.error('Error fetching job offers:', error);
        setError('Error al cargar las ofertas de trabajo. Por favor, intente nuevamente más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobOffers();
  }, [query, location]);

  const handleJobClick = (job: JobOffer) => {
    setSelectedJob(job);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resultados de búsqueda</h1>
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4 flex gap-8">
        <section className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Resultados para "{query}" en "{location}"</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10">Cargando ofertas de trabajo...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-600">{error}</div>
              ) : jobOffers.length === 0 ? (
                <div className="text-center py-10">No se encontraron ofertas de trabajo que coincidan con tu búsqueda.</div>
              ) : (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="space-y-4 pr-4">
                    {jobOffers.map((job) => (
                      <Card key={job.id} className={`cursor-pointer transition-all ${selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''}`} onClick={() => handleJobClick(job)}>
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-600">{job.title}</CardTitle>
                          <CardDescription>{job.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            {job.modality}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {job.salary}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Publicado el {new Date(job.publication_date).toLocaleDateString()}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{job.typeOfcontract}</Badge>
                            {job.requeriments.split(',').map((req, index) => (
                              <Badge key={index} variant="outline">{req.trim()}</Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </section>

        {selectedJob && (
          <section className="w-1/3 animate-slide-in-right">
            <Card>
              <CardHeader>
                <CardTitle>{selectedJob.title}</CardTitle>
                <CardDescription>{selectedJob.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedJob.modality}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Publicado el {new Date(selectedJob.publication_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{selectedJob.schedule}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      <span>{selectedJob.experience}</span>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Requisitos:</h3>
                      <ul className="list-disc list-inside">
                        {selectedJob.requeriments.split(',').map((req, index) => (
                          <li key={index}>{req.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Postularse</Button>
              </CardFooter>
            </Card>
          </section>
        )}
      </main>
    </div>
  )
}