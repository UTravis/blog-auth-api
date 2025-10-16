import jwt from 'jsonwebtoken';

export function verifyToken(request: Request) {
    const authHeader = request.headers.get("authorization");

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new Error("No Token Provided");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        console.error("Invalid token", error);
        throw new Error("Invalid token");
    }
}