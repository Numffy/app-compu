import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

          // Aseguramos que los campos id, email y token están presentes y son de tipo string
          if (!userdata?.id || !userdata?.email || !userdata?.token) {
            throw new Error("Datos de usuario incompletos");
          }

          // Aseguramos que los valores sean cadenas de texto
          const user = {
            id: String(userdata.id),
            email: String(userdata.email),
            token: String(userdata.token),
          };

          return user;
        } catch (error: any) {
          console.error("Error en la autenticación:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Asignamos los valores al token, asegurándonos de que sean cadenas
        token.id = String(user.id);
        token.email = String(user.email);
        token.token = String(user.token);
      }
      return token;
    },
    async session({ session, token }) {
      // Asignamos los valores al session.user, asegurándonos de que sean cadenas
      session.user = {
        id: String(token.id),
        email: String(token.email),
        token: String(token.token),
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
