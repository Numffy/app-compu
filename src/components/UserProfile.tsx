"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Pencil, Save, Upload, X, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  registration_date: string;
  name: string;
  lastname: string;
  email: string;
  gender: string;
  experience: string;
  description: string;
  video: string;
}

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { data: session, status } = useSession();
  const userId = session?.user.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://172.21.234.224:3001/api/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(
        "Error al cargar los datos del usuario. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({
      description: user?.description,
      experience: user?.experience,
    });
  };

  const handleSave = async () => {
    if (status === "authenticated") {
      setIsLoading(true);
      try {
        const response = await axios.patch(
          `http://172.21.234.224:3001/api/users/${userId}`,
          editedUser
        );
        setUser(response.data);
        setIsEditing(false);
        setError(null);
        toast({
          title: "Perfil actualizado",
          description: "Tus cambios han sido guardados exitosamente.",
        });
      } catch (error) {
        console.error("Error updating user data:", error);
        setError(
          "Error al actualizar los datos del usuario. Por favor, intente nuevamente."
        );
        toast({
          variant: "destructive",
          title: "Error al actualizar el perfil",
          description: "Por favor, intente nuevamente.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile || !userId) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(
        `http://172.21.234.224:3001/api/users/video/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
            setUploadProgress(percentCompleted);
          },
        }
      );

      const videoUrl = response.data;
      setUser(prev => prev ? { ...prev, video: videoUrl } : null);
      setError(null);
      toast({
        title: "Video subido exitosamente",
        description: "Tu video de presentación ha sido actualizado.",
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Error al subir el video. Por favor, intente nuevamente.');
      toast({
        variant: "destructive",
        title: "Error al subir el video",
        description: "Por favor, intente nuevamente.",
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchUserData(); // Refrescar los datos del usuario después de la subida
    }
  };

  const cancelVideoUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReturn = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">Cargando perfil de usuario...</div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        No se encontró el perfil de usuario.
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <Button onClick={handleReturn} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
          <CardDescription>
            Visualiza y edita tu información personal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Nombre completo</Label>
              <p className="text-lg font-medium">{`${user.name} ${user.lastname}`}</p>
            </div>
            <div>
              <Label>Correo electrónico</Label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <Label>Género</Label>
              <p className="text-lg">{user.gender}</p>
            </div>
            <div>
              <Label>Fecha de registro</Label>
              <p className="text-lg">
                {new Date(user.registration_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  name="description"
                  value={editedUser.description || ""}
                  onChange={handleInputChange}
                  rows={4}
                />
              ) : (
                <p className="text-lg">{user.description}</p>
              )}
            </div>
            <div>
              <Label htmlFor="experience">Experiencia</Label>
              {isEditing ? (
                <Textarea
                  id="experience"
                  name="experience"
                  value={editedUser.experience || ""}
                  onChange={handleInputChange}
                  rows={4}
                />
              ) : (
                <p className="text-lg">{user.experience}</p>
              )}
            </div>
            <div>
              <Label htmlFor="video">Video de presentación</Label>
              {user.video && !previewUrl ? (
                <div className="mt-2">
                  <video controls className="w-full max-w-md">
                    <source src={user.video} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              ) : previewUrl ? (
                <div className="mt-2">
                  <video controls className="w-full max-w-md">
                    <source src={previewUrl} type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              ) : (
                <p className="text-lg">No se ha subido un video de presentación</p>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                ref={fileInputRef}
              />
              {!selectedFile ? (
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Seleccionar video
                </Button>
              ) : (
                <div className="mt-2 space-y-2">
                  <p className="text-sm">Archivo seleccionado: {selectedFile.name}</p>
                  <div className="flex space-x-2">
                    <Button onClick={handleVideoUpload} disabled={isUploading}>
                      {isUploading ? 'Subiendo...' : 'Subir video'}
                    </Button>
                    <Button variant="outline" onClick={cancelVideoUpload}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
              {isUploading && (
                <div className="mt-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-500 mt-1">
                    {uploadProgress.toFixed(0)}% completado
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {isEditing ? (
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Guardar cambios
            </Button>
          ) : (
            <Button onClick={handleEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar perfil
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}