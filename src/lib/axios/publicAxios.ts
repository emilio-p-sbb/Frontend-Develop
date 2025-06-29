import axios, { AxiosRequestConfig } from "axios"

export async function apiRequestPublic<T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await publicAxios.request({
    url,
    method,
    data,
    ...config,
  })
  return response.data
}

const publicAxios = axios.create({
  baseURL: "",
  timeout: 10000,
  withCredentials: false, // tidak kirim cookie
  headers: {
    "Content-Type": "application/json",
  },
})

export default publicAxios;