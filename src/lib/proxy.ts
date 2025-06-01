// // lib/proxy.ts
// import { AUTH_API_URL } from '@/constant/env';
// import { NextRequest, NextResponse } from 'next/server';

// const services: Record<string, string> = {
//   users: AUTH_API_URL,
//   skills: AUTH_API_URL,
//   auth: AUTH_API_URL,
//   // Tambahkan lainnya jika perlu
// };

// export async function handler(req: NextRequest, context: { params: { slug: string[] } }) {
//   const { slug } = context.params;
//   const method = req.method.toUpperCase();

//   const serviceName = slug?.[0];
//   if (!serviceName || !services[serviceName]) {
//     return NextResponse.json({ message: 'Invalid service name' }, { status: 400 });
//   }

//   const baseURL = services[serviceName];
//   const targetPath = slug.slice(1).join('/');
//   const targetURL = `${baseURL}/${targetPath}`;

//   const headers: Record<string, string> = {};

//   // Tambahkan cookie secara eksplisit (untuk memastikan dikirim ke backend)
//   const cookieHeader = req.headers.get('cookie');

//   if (cookieHeader) headers['cookie'] = cookieHeader;

//   const authHeader = req.headers.get('authorization');
//   if (authHeader) headers['authorization'] = authHeader;

//   const csrfHeader = req.headers.get('x-csrf-token');
//   if (csrfHeader) {
//     headers['X-CSRF-TOKEN'] = csrfHeader;
//   }


//   const fetchOptions: RequestInit = {
//     method,
//     headers,
//     body: ['GET', 'HEAD'].includes(method) ? undefined : await req.text(),
//     credentials: 'include',
//   };

//   try {
//     const response = await fetch(targetURL, fetchOptions);

//     const contentType = response.headers.get('content-type') || '';
//     const status = response.status;

//     if (contentType.includes('application/json')) {
//       const data = await response.json();
//       return NextResponse.json(data, { status });
//     }

//     const text = await response.text();
//     return new NextResponse(text, {
//       status,
//       headers: { 'Content-Type': contentType },
//     });
//   } catch (error) {
//     console.error('Proxy error:', error);
//     return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//   }
// }


// import { AUTH_API_URL } from "@/constant/env"
// import { type NextRequest, NextResponse } from "next/server"

// const services: Record<string, string> = {
//   users: AUTH_API_URL,
//   skills: AUTH_API_URL,
//   auth: AUTH_API_URL,
//   portfolio: AUTH_API_URL,
//   projects: AUTH_API_URL,
// }

// export async function handler(req: NextRequest, context: { params: { slug: string[] } }) {
//   const { slug } = context.params
//   const method = req.method.toUpperCase()

//   const serviceName = slug?.[0]
//   if (!serviceName || !services[serviceName]) {
//     return NextResponse.json({ message: "Invalid service name" }, { status: 400 })
//   }

//   const baseURL = services[serviceName]
//   const targetPath = slug.slice(1).join("/")
//   const targetURL = `${baseURL}/${targetPath}${req.nextUrl.search}`

//   const headers: Record<string, string> = {
//     "Content-Type": "application/json",
//   }

//   // Forward all relevant headers
//   const headersToForward = ["authorization", "content-type", "x-csrf-token", "user-agent", "accept", "accept-language"]

//   headersToForward.forEach((headerName) => {
//     const headerValue = req.headers.get(headerName)
//     if (headerValue) {
//       headers[headerName] = headerValue
//     }
//   })

//   // Forward cookies
//   const cookieHeader = req.headers.get("cookie")
//   if (cookieHeader) {
//     headers["cookie"] = cookieHeader
//   }

//   let body: string | undefined
//   if (!["GET", "HEAD"].includes(method)) {
//     try {
//       body = await req.text()
//     } catch (error) {
//       console.error("Error reading request body:", error)
//     }
//   }

//   const fetchOptions: RequestInit = {
//     method,
//     headers,
//     body,
//     credentials: "include",
//   }

//   try {
//     console.log(`Proxying ${method} ${targetURL}`)
//     const response = await fetch(targetURL, fetchOptions)

//     const contentType = response.headers.get("content-type") || ""
//     const status = response.status

//     // Forward response headers
//     const responseHeaders = new Headers()
//     response.headers.forEach((value, key) => {
//       if (!["content-encoding", "content-length", "transfer-encoding"].includes(key.toLowerCase())) {
//         responseHeaders.set(key, value)
//       }
//     })

//     if (contentType.includes("application/json")) {
//       const data = await response.json()
//       return NextResponse.json(data, { status, headers: responseHeaders })
//     }

//     const text = await response.text()
//     return new NextResponse(text, {
//       status,
//       headers: responseHeaders,
//     })
//   } catch (error) {
//     console.error("Proxy error:", error)
//     return NextResponse.json(
//       { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 },
//     )
//   }
// }


import { AUTH_API_URL } from "@/constant/env"
import { type NextRequest, NextResponse } from "next/server"

const services: Record<string, string> = {
  users: AUTH_API_URL,
  skills: AUTH_API_URL,
  auth: AUTH_API_URL,
  portfolio: AUTH_API_URL,
  projects: AUTH_API_URL,
}

export async function handler(req: NextRequest, context: { params: { slug: string[] } }) {
  const { slug } = context.params
  const method = req.method.toUpperCase()

  const serviceName = slug?.[0]
  if (!serviceName || !services[serviceName]) {
    return NextResponse.json({ message: "Invalid service name" }, { status: 400 })
  }

  const baseURL = services[serviceName]
  const targetPath = slug.slice(1).join("/")
  const targetURL = `${baseURL}/${targetPath}${req.nextUrl.search}`

  console.log(`🎯 Proxying: ${method} ${targetURL}`)

  // Buat headers baru
  const headers = new Headers()

  // Set Content-Type
  headers.set("Content-Type", "application/json")

  // Forward cookies - ini yang paling penting untuk authentication
  const cookieHeader = req.headers.get("cookie")
  if (cookieHeader) {
    headers.set("cookie", cookieHeader)
    console.log("🍪 Forwarding cookies:", cookieHeader)
  } else {
    console.log("❌ No cookies found in request")
  }

  // Forward other relevant headers
  const headersToForward = ["user-agent", "accept", "accept-language", "x-csrf-token"]
  headersToForward.forEach((headerName) => {
    const headerValue = req.headers.get(headerName)
    if (headerValue) {
      headers.set(headerName, headerValue)
    }
  })

  let body: string | undefined
  if (!["GET", "HEAD"].includes(method)) {
    try {
      body = await req.text()
    } catch (error) {
      console.error("Error reading request body:", error)
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    body,
    credentials: "include", // Penting untuk meneruskan cookies
  }

  try {
    console.log("📤 Request headers being sent:", Object.fromEntries(headers.entries()))

    const response = await fetch(targetURL, fetchOptions)

    console.log(`📥 Response status: ${response.status}`)

    // Log response headers untuk debugging
    console.log("📥 Response headers:")
    const responseHeadersObj: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeadersObj[key] = value
      console.log(`  ${key}: ${value}`)
    })

    // Create response dengan proper headers
    const contentType = response.headers.get("content-type") || ""
    const status = response.status

    let responseData: any
    if (contentType.includes("application/json")) {
      responseData = await response.json()
      console.log("📥 Response data:", responseData)
    } else {
      responseData = await response.text()
    }

    // Buat response baru
    const nextResponse = contentType.includes("application/json")
      ? NextResponse.json(responseData, { status })
      : new NextResponse(responseData, { status })

    // Forward semua headers dari backend response
    response.headers.forEach((value, key) => {
      // Jangan forward headers yang bisa menyebabkan masalah
      if (!["content-encoding", "content-length", "transfer-encoding"].includes(key.toLowerCase())) {
        nextResponse.headers.set(key, value)

        // Log Set-Cookie headers khusus
        if (key.toLowerCase() === "set-cookie") {
          console.log("🍪 Setting cookie from backend:", value)
        }
      }
    })

    return nextResponse
  } catch (error) {
    console.error("❌ Proxy error:", error)
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
