import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"
import { Session } from "next-auth"

// Create axios instance
const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true, // Ini penting untuk mengirim cookies
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor untuk debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`)

    // Debug: Log cookies yang akan dikirim
    if (typeof window !== "undefined") {
      console.log("🍪 Cookies being sent:", document.cookie)
    }

    return config
  },
  (error) => {
    console.error("❌ Request error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor untuk error handling dan debugging
axiosInstance.interceptors.response.use(
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

export const apiRequest = async (
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<any> => {
  const response = await axiosInstance.request({
    url,
    method,
    data,
    ...config,
  })

  return response.data
}

export default axiosInstance
