import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
    username?: string
    phone?: string
    email?: string
    id?: number
  }

  interface User {
    accessToken?: string
    refreshToken?: string
    username?: string
    phone?: string
    email?: string
    id?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    username?: string
    phone?: string
    email?: string
    id?:number
  }
}
