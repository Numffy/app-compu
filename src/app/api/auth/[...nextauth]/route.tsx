import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Definimos las interfaces para los datos del JWT y de la sesión
interface MyJWT extends JWT {
  id: string;
  email: string;
  token: string;
}

interface MySession extends Session {
  user: MyJWT;
}

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials!; 
          const loginData = { email, password };

          const response = await fetch(
           'http://172.21.234.224:3001/api/auth/user/login',
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginData),
            }
          );

          if (!response.ok) {
            throw new Error("Error al iniciar sesión");
          }

          const userdata = await response.json(); 
          return userdata;
        } catch (error: any) {
          console.error("Error en la autenticación:", error);
          return null;
        }
      },
    }),
  ],
  pages:{
    signIn: "/auth/login"
  },
  session:{
    strategy:"jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      return {...token,...user}
    },
    async session({ session, token }) {
      session.user = token as MyJWT;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
