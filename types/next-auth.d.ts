import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";


interface MyJWT extends DefaultJWT {
  email: string;
  token: string;
}


interface MyUser extends DefaultUser {
  email: string;
  token: string;
}

declare module "next-auth" {
  interface Session {
    user: MyUser;
  }

  interface User extends MyUser {} 
}

declare module "next-auth/jwt" {
  interface JWT extends MyJWT {} 
}
