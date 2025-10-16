import connect from "@/lib/db"
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user and return a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

export const POST = async (request: Request) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
        await connect();
        const { email, password } = await request.json();

        const user = await User.findOne({email});
        if(!user) return NextResponse.json({message: "User not found"}, {status: 404});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return NextResponse.json({message: "Invalid credentials"}, {status: 401});

        const token = jwt.sign(
            {id: user._id, email: user.email},
            secret,
            {expiresIn: "1d"}
        );

        return NextResponse.json({token}, {status: 200});
    } catch (error) {
        console.error("Error with user login", error);
        return NextResponse.json({message: "Could not login user"}, {status: 500});
    }
}