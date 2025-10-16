import User from "@/models/User";
import connect from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account using the provided email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: myStrongPassword123
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 65ab1ef3d2c4a1d9e7f8b123
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 *                   example: Could not register user
 */

export const POST = async (request: Request) => {
    try {
        await connect();
        const {email, password} = await request.json();

        const existingUser = await User.findOne({email});
        if(existingUser){
            return new NextResponse(JSON.stringify({message: "User already exists"}), {status: 400})
        }

        const user = await User.create({email, password});
        return NextResponse.json({message: "User created", user}, {status: 201});

    } catch (error) {
        console.error("Error registering user", error);
        return NextResponse.json({Error: "Could not register user"}, {status: 500})
    }
}