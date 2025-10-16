import { verifyToken } from "@/lib/auth";
import connect from "@/lib/db"
import Blog from "@/models/Blog";
import User from "@/models/User";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Fetch all blogs
 *     description: Retrieves all blog posts from the database along with their associated user emails.
 *     tags: [Blog]
 *     responses:
 *       201:
 *         description: Blogs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched blogs successfully
 *                 blogs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 671003e527a0f112a498cf4d
 *                       title:
 *                         type: string
 *                         example: How to Build a REST API with Next.js
 *                       content:
 *                         type: string
 *                         example: This article explains how to build a RESTful API using Next.js 14 route handlers...
 *                       user:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: johndoe@example.com
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Could not fetch blogs
 */

export const GET = async () => {
    try {
        await connect();

        const blogs = await Blog.find().populate("user", "email");
        //const blogs = await Blog.find();
        return NextResponse.json({message: "Fetched blogs successfully", blogs}, {status: 201});
    } catch (error) {
        console.error("Error fetching blogs", error);
        return NextResponse.json({message: "Could not fetch blogs"}, {status: 500});
    }
}

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     tags:
 *       - Blog
 *     summary: Create a new blog post
 *     description: Allows an authenticated user to create a new blog post. Requires a valid JWT token.
 *     operationId: createBlog
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "10 Tips for Learning Next.js Fast"
 *               description:
 *                 type: string
 *                 example: "In this post, I’ll share some strategies for mastering Next.js quickly..."
 *               category:
 *                 type: string
 *                 example: "672f109adcf10ad38c3d9f0b"
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog created successfully
 *                 newBlog:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6730a21c39b70b1491b7d0d2
 *                     title:
 *                       type: string
 *                       example: 10 Tips for Learning Next.js Fast
 *                     description:
 *                       type: string
 *                       example: In this post, I’ll share some strategies...
 *                     user:
 *                       type: string
 *                       example: 672f0f48d2f44ad38b2c8ee7
 *                     category:
 *                       type: string
 *                       example: 672f109adcf10ad38c3d9f0b
 *                     createdAt:
 *                       type: string
 *                       example: 2025-10-05T10:00:00.000Z
 *       401:
 *         description: Unauthorized or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error while creating blog
 */
export const POST = async (request: Request) => {
    try {
        await connect();
        //const user = verifyToken(request);
        
        const userHeader = request.headers.get("user");
        const user = userHeader ? JSON.parse(userHeader) : null;

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const {title, description, category} = await request.json();

        const newBlog = new Blog({
            title,
            description,
            category,
            user: user.id
        })

        await newBlog.save();
        return NextResponse.json({message: "Blog created successfully", newBlog}, {status: 201});
    } catch (error) {
        console.error("Error creating blog", error);
        return NextResponse.json({message: "Could not create blog", error }, { status: 401 });
    }   
}