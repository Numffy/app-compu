"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { User, Building2 } from 'lucide-react';

export default function RegisterOptions() {
  const router = useRouter();

  const handleUserRegister = () => {
    router.push('auth/register/user');
  };

  const handleCompanyRegister = () => {
    router.push('auth/register/company');
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Registro en CompuTrabajo</CardTitle>
          <CardDescription>Elige el tipo de cuenta que deseas crear</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleUserRegister} 
            className="w-full h-16 text-lg flex items-center justify-center space-x-2"
            variant="outline"
          >
            <User className="h-6 w-6 mr-2" />
            <span>Registro de Usuario</span>
          </Button>
          <Button 
            onClick={handleCompanyRegister} 
            className="w-full h-16 text-lg flex items-center justify-center space-x-2"
            variant="outline"
          >
            <Building2 className="h-6 w-6 mr-2" />
            <span>Registro de Empresa</span>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta? <a href="auth/login" className="text-blue-600 hover:underline">Inicia sesión aquí</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}