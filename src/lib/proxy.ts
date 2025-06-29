import { AUTH_API_URL } from "@/constant/env"
import { type NextRequest, NextResponse } from "next/server"

const services: Record<string, string> = {
  users: AUTH_API_URL,
  skills: AUTH_API_URL,
  experiences: AUTH_API_URL,
  educations: AUTH_API_URL,
  auth: AUTH_API_URL,
  portfolio: AUTH_API_URL,
  projects: AUTH_API_URL,
  messages: AUTH_API_URL,
  home: AUTH_API_URL,
}

export async function handler(req: NextRequest, context: { params: { slug: string[] } }) {
  const { slug } = context.params
  if (!slug || slug.length === 0) {
    return NextResponse.json({ message: "Missing service path" }, { status: 400 })
  }

  const method = req.method.toUpperCase()

  const serviceName = slug?.[0]
  console.log('serviceName = '+serviceName)
  if (!serviceName || !services[serviceName]) {
    return NextResponse.json({ message: "Invalid service name" }, { status: 400 })
  }

  const baseURL = services[serviceName]
  console.log('baseURL = '+baseURL)
  console.log('slug slice = '+slug.slice(1).join("/"))
  // const targetPath = slug.slice(1).join("/")
  const targetPath = slug.join("/")
  console.log('slug = '+slug)
  const targetURL = `${baseURL}/${targetPath}${req.nextUrl.search}`

  console.log('targetURL = '+targetURL)
  // Prepare headers
  const headers: Record<string, string> = {}

  // Forward cookies - CRITICAL for authentication
  const cookieHeader = req.headers.get("cookie")
  if (cookieHeader) {
    headers["cookie"] = cookieHeader
    console.log("🍪 Forwarding cookies:", cookieHeader)
  } else {
    console.log("❌ No cookies found in request")
  }

  const authHeader = req.headers.get("authorization")
  if (authHeader) {
    headers["authorization"] = authHeader
    console.log("🔐 Forwarding Authorization header:", authHeader)
  } else {
    console.log("⚠️ No Authorization header found in request")
  }


  // Forward other headers
  const headersToForward = ["user-agent", "accept", "accept-language"]
  headersToForward.forEach((headerName) => {
    const headerValue = req.headers.get(headerName)
    if (headerValue) {
      headers[headerName] = headerValue
    }
  })

  // Set Content-Type for non-GET requests
  if (!["GET", "HEAD"].includes(method) && !headers["content-type"] && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  let body: string | undefined
  if (!["GET", "HEAD"].includes(method)) {
    try {
      body = await req.text()
    } catch (error) {
      console.error("Error reading request body:", error)
    }
  }

  try {
    console.log("📤 Headers being sent:", headers)

    const response = await fetch(targetURL, {
      method,
      headers,
      body,
      credentials: "include",
    })

    console.log(`📥 Response status: ${response.status}`)

    // Log response headers
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
      if (key.toLowerCase() === "set-cookie") {
        console.log("🍪 Set-Cookie from backend:", value)
      }
    })

    const contentType = response.headers.get("content-type") || ""
    let responseData: any

    if (contentType.includes("application/json")) {
      responseData = await response.json()
      console.log("📥 Response data:", responseData)
    } else {
      responseData = await response.text()
    }

    const nextResponse = contentType.includes("application/json") ? NextResponse.json(responseData, { status: response.status }) : new NextResponse(responseData, { status: response.status })

    // ✅ Tambahkan ini untuk forward cookie dari response
    const setCookie = response.headers.get("set-cookie")
    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie)
      console.log("🍪 Forwarding Set-Cookie to client:", setCookie)
    }


    return nextResponse
  } catch (error) {
    console.error("❌ Proxy error:", error)
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}


