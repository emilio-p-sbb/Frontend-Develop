import axios, { AxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"

// Create axios instance
const privateAxios = axios.create({
  baseURL: "",
  withCredentials: true, // Ini penting untuk mengirim cookies
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor REQUEST – inject Authorization header
privateAxios.interceptors.request.use(
  async (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`)

    // Ambil session dari NextAuth
    const session = await getSession()
    const accessToken = session?.accessToken

    console.log('accessToken req = '+accessToken)
    if (accessToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${accessToken}`
      console.log("🔐 Authorization header set:", config.headers.Authorization)
    } else {
      console.warn("⚠️ No access token found in session")
    }

    return config
  },
  (error) => {
    console.error("❌ Request error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor untuk error handling dan debugging
privateAxios.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status)
    return response
  },
  async (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    })

    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - redirecting to login")
      // Handle unauthorized - redirect ke login
      if (typeof window !== "undefined") {
        // window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export async function apiRequest<T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  console.log('url request axios = '+url)

  const headers: Record<string, string> = {};

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await privateAxios.request({
    url,
    method,
    data,
    withCredentials: true,
    headers: {
      ...headers,
      ...(config?.headers || {}),
    },
    ...config,
  });

  return response.data
}


export default privateAxios;