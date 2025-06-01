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

          const loginAxios = axios.create({
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          })

          // PENTING: Gunakan URL langsung ke backend, bukan melalui proxy
          const res = await loginAxios.post(`${AUTH_API_URL}/auth/signin`, {
            username: credentials.username,
            password: credentials.password,
          })

          // Log Set-Cookie headers jika ada
          if (res.headers["set-cookie"]) {
            console.log("🍪 Set-Cookie headers:", res.headers["set-cookie"])
          }

          if (res.status === 200 && res.data.accessToken) {
            const { accessToken, refreshToken, information } = res.data;

            console.log("✅ Login successful for user:", information.fullname)

            // Simpan cookie secara manual jika di browser
            if (typeof window !== "undefined") {
              // Parse Set-Cookie header dan set cookie di browser
              if (res.headers["set-cookie"]) {
                res.headers["set-cookie"].forEach((cookie: string) => {
                  document.cookie = cookie.split(";")[0] + "; path=/;"
                })
              }
            }
            
            // Mengembalikan objek user dengan data tambahan jika login berhasil
            return {
              id: information.userId, // ID pengguna
              fullname: information.fullname, // Nama pengguna
              email: information.email, // Email pengguna
              phone: information.phone, // Phone pengguna
              accessToken, // Menyimpan accessToken untuk digunakan di JWT
              refreshToken, // Jika perlu refreshToken
            };
          } else {
            console.error("Invalid login response:", JSON.stringify(res.data));
            return null;
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
      // session.accessToken = token.accessToken; // Menyimpan accessToken dalam sesi
      // session.refreshToken = token.refreshToken; // Menyimpan refreshToken dalam sesi jika perlu
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
