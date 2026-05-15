import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { createCommentSchema } from "@/app/schemas/post";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userId = verifyToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validatedData = createCommentSchema.parse({
      ...body,
      authorId: userId,
    });

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId: validatedData.postId,
        authorId: userId,
        authorName: validatedData.authorName,
        body: validatedData.body,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
