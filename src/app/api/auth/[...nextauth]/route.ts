import { AUTH_API_URL } from "@/constant/env"; // Mengimpor URL API untuk otentikasi
import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// Konfigurasi NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    // Provider untuk otentikasi menggunakan kredensial (username dan password)
    CredentialsProvider({
      name: "Credentials", // Nama provider
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Fungsi authorize yang akan dijalankan saat login
      async authorize(credentials) {
        // Mengecek apakah kredensial ada
        if (!credentials) {
          console.error("No credentials provided");
          return null;
        }
        try {

          const loginResponse = await axios.post(
            `${AUTH_API_URL}/auth/signin`,
            {
              username: credentials.username,
              password: credentials.password,
            },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            },
          )

          console.log("✅ Login response status:", loginResponse.status)
          console.log("🍪 Set-Cookie headers:", loginResponse.headers["set-cookie"])

          if (loginResponse.status === 200 && loginResponse.data) {
            const { accessToken, refreshToken, information } = loginResponse.data

            console.log("✅ Login successful for user:", information.fullname)

            return {
              id: information.userId.toString(),
              name: information.fullname,
              email: information.email,
              phone: information.phone,
              accessToken,
              refreshToken,
            }
          } else {
            console.error("❌ Invalid login response")
            return null
          }
        } catch (e: any) {
          if (e.response && e.response.data) {
            const { message, generalErrors, fieldErrors } = e.response.data;
            // Anda bisa lempar error custom agar ditangani NextAuth secara global atau ditampilkan di halaman login
            throw new Error(message || (generalErrors && generalErrors[0]) || "Login gagal");
          }

            throw new Error("Terjadi kesalahan saat login");
          }
        },
      }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  // Mengatur sesi dengan JWT
  session: {
    strategy: "jwt", // Gunakan JWT untuk strategi sesi
    maxAge: 15 * 60, // Durasi sesi dalam detik (15 menit)
    // maxAge: 24 * 60 * 60, // 24 hours
  },
  // Callback untuk JWT dan sesi
  callbacks: {
    // Callback saat token JWT sedang dibuat
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.id = user.id
        token.phone = user.phone
        console.log("💾 Storing user data in JWT token")
      }
      return token
    },
    // Callback untuk sesi, menambahkan data token ke dalam sesi
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken; // Menyimpan accessToken dalam sesi
      session.refreshToken = token.refreshToken; // Menyimpan refreshToken dalam sesi jika perlu
      session.id = token.id;
      session.username = token.username; // Menyimpan username dalam sesi
      session.email = token.email; // Menyimpan email dalam sesi
      session.phone = token.phone; // Menyimpan phone dalam sesi
      return session;
    },
  },

  // Mengatur halaman khusus untuk login
  pages: {
    signIn: "/login", // Ganti dengan URL halaman login Anda
    error: "/login",
  },

  // Mengatur pengaturan debug (optional, berguna untuk debugging)
  debug: process.env.NODE_ENV === "development",
};

// Membuat handler untuk NextAuth dengan opsi yang telah dikonfigurasi
const handler = NextAuth(authOptions);

// Mengekspor handler untuk menangani permintaan GET dan POST
export { handler as GET, handler as POST };
