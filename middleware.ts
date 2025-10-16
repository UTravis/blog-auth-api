import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware (request: NextRequest) {

    try {
        const token = request.cookies.get("token")?.value || request.headers.get("authorization")?.replace("Bearer ","");

        if(!token) return NextResponse.json({message: "Unauthorized: No token"}, {status: 401});

        // ✅ jose works on the Edge Runtime
        const {payload} = await jwtVerify(token, SECRET);

        // Save decoded user data in request headers for downstream use
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("user", JSON.stringify(payload)); // payload contains id, email, etc.

        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        });
    } catch (error) {
        console.error("Invalid token", error);
        return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }
}


export const config = {
    matcher: [
        "/api/blogs/:path*"
    ]
}