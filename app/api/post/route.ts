import { NextResponse } from "next/server";
import { createPost } from "@/actions/post";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const post = await createPost(formData);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Create post failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
