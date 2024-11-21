import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

interface MyJWT extends DefaultJWT {
  id: string | undefined; // Permitir que id pueda ser undefined
  email: string | undefined; // Permitir que email pueda ser undefined
  token: string | undefined; // Permitir que token pueda ser undefined
}

interface MyUser extends DefaultUser {
  id: string | undefined; // Permitir que id pueda ser undefined
  email: string | undefined; // Permitir que email pueda ser undefined
  token: string | undefined; // Permitir que token pueda ser undefined
}

declare module "next-auth" {
  interface Session {
	user: MyUser;
  }

interface User extends MyUser {} }

declare module "next-auth/jwt" { interface JWT extends MyJWT {} }