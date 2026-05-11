"use server";

import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/app/schemas/post";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function createPost(data: {
  title: string;
  body: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userId = verifyToken(token);

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      body: data.body,
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
