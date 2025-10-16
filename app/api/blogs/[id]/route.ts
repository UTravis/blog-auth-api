import connect from "@/lib/db";
import Blog from "@/models/Blog";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/blogs/{id}:
 *   patch:
 *     summary: Update a blog post
 *     description: Updates a specific blog post by its ID. Only the user who created the blog can update it.
 *     tags:
 *       - Blog
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the blog to update
 *         schema:
 *           type: string
 *           example: 671004c827a0f112a498cf55
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Blog Title
 *               description:
 *                 type: string
 *                 example: This is the updated blog content...
 *     security:
 *       - userHeader: []
 *     responses:
 *       201:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog updated!
 *                 blog:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 671004c827a0f112a498cf55
 *                     title:
 *                       type: string
 *                       example: Updated Blog Title
 *                     description:
 *                       type: string
 *                       example: Updated description of the blog
 *                     user:
 *                       type: string
 *                       example: 671001a527a0f112a498cf22
 *       400:
 *         description: Invalid Blog ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Blog ID Provided
 *       401:
 *         description: Unauthorized request (missing or invalid user header)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Blog not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog not found!
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not patch blog
 */

export const PATCH = async (request: Request, context: {params: Promise<{id: string}>}) => {
    const { id } = await context.params;
    const blogId = id;

    if(!blogId || !Types.ObjectId.isValid(blogId))
    {
        return NextResponse.json({message: "Invalid Blog ID Provided"}, {status: 400});
    }

    try {
        await connect();

        const userHeader = request.headers.get("user");
        const user = userHeader ? JSON.parse(userHeader) : null;

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const {title, description} = await request.json();

        const blog = await Blog.findByIdAndUpdate(
            {_id: blogId, user: user.id},
            {title, description},
            {new: true}
        );

        if(!blog) return NextResponse.json({message: "Blog not found!"}, {status: 404});

        return NextResponse.json({message: "Blog updated!", blog}, {status: 201});

    } catch (error) {
        console.error("Error - could not patch blog", error);
        return NextResponse.json({ error: error }, { status: 401 });
    }
}

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Deletes a specific blog post by its ID. Only the authenticated user who owns the blog can delete it.
 *     tags:
 *       - Blog
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the blog to delete
 *         schema:
 *           type: string
 *           example: 671004c827a0f112a498cf55
 *     security:
 *       - userHeader: []
 *     responses:
 *       201:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Blog deleted!
 *       400:
 *         description: Invalid Blog ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Blog ID Provided
 *       401:
 *         description: Unauthorized request (missing or invalid user header)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Blog not found or not owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Blog not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not delete blog
 */

export const DELETE = async (request: Request, context: {params: Promise<{id: string}>}) => {
    const {id} = await context.params;
    const blogId = id;

    if(!blogId || !Types.ObjectId.isValid(blogId))
    {
        return NextResponse.json({message: "Invalid Blog ID Provided"}, {status: 400});
    }

    try {
        await connect();

        const userHeader = request.headers.get("user");
        const user = userHeader ? JSON.parse(userHeader) : null;

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const blog = await Blog.findByIdAndDelete({_id: blogId, user:user.id});
        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

        return NextResponse.json({message: "Blog deleted!"}, {status: 201});
    } catch (error) {
        console.error("Error - could not delete blog", error);
        return NextResponse.json({ error: error }, { status: 401 });
    }
}