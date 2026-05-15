"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createId } from "@paralleldrive/cuid2";

export async function createPost(formData: FormData) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const userId = verifyToken(token);

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const image = formData.get("image") as File | null;
  let imageUrl: string | undefined = undefined;

  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = image.name.split(".").pop() || "bin";
    const filename = `${createId()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadsDir, { recursive: true });
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    imageUrl = `/uploads/${filename}`;
  }

  const post = await prisma.post.create({
    data: {
      title,
      body,
      imageUrl,
      authorId: userId,
    },
  });

  return post;
}

export async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}

export async function getUserPosts() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userId = verifyToken(token);

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}

export async function getPostById(postId: string) {
  return await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function searchPosts(term: string) {
  return await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: term,
            mode: "insensitive",
          },
        },
        {
          body: {
            contains: term,
            mode: "insensitive",
          },
        },
      ],
    },
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userId = verifyToken(token);

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return user;
}

export async function createComment(
  postId: string,
  authorName: string,
  body: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userId = verifyToken(token);

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId: userId,
      authorName,
      body,
    },
  });

  return comment;
}
