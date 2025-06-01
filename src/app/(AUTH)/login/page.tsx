'use client';

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, User, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signIn } from "next-auth/react";

// definisi schema validasi dengan Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // setup react-hook-form dengan zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      // Menggunakan NextAuth untuk login
      const res = await signIn("credentials", {
        redirect: false,
        username: values.username, 
        password: values.password,
      });

      console.log('res json = '+JSON.stringify(res))
      // Jika login berhasil
      if (res?.ok && res?.status === 200) {
        router.push("/admin"); // Arahkan pengguna ke halaman admin setelah login sukses
        router.refresh();
      }else if (res?.error) {
        form.setError("root", { type: "server", message: res.error });
        return;
      }
      else {
        throw new Error("Login failed");
      }
    } catch (error) {
      form.setError("root", { type: "server", message: "Login failed due to an unexpected error." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-portfolio-navy/10 mx-auto flex items-center justify-center mb-4">
              <User size={36} className="text-portfolio-navy" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Sign in to access your portfolio dashboard</p>
          </div>

          {form.formState.errors.root && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center space-x-2">
              <AlertTriangle size={18} />
              <span>{form.formState.errors.root.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className={`pl-10 focus:ring-portfolio-light-blue focus:border-portfolio-light-blue ${
                    errors.username ? "border-red-500" : ""
                  }`}
                  {...register("username")}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                <Link href="#" className="text-sm text-portfolio-light-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`pl-10 focus:ring-portfolio-light-blue focus:border-portfolio-light-blue ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            
            <Button
              type="submit"
              className="w-full bg-portfolio-navy hover:bg-portfolio-blue transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-portfolio-light-blue hover:underline">
              Return to Portfolio
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
