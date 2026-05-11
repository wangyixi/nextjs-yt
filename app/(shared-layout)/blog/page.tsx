/* eslint-disable @next/next/no-img-element */
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getUserPosts } from "@/actions/post";

export const metadata: Metadata = {
  title: "Blog | Next.js 16 Tutorial",
  description: "Read our latest articles and insights.",
  category: "Web development",
  authors: [{ name: "Jan marshal" }],
};

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          My Blog Posts
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Your published articles and insights.
        </p>
      </div>

      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense>
    </div>
  );
}

async function LoadBlogList() {
  try {
    const posts = await getUserPosts();

    if (!posts || posts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts yet. Create your first post!</p>
          <Link href="/create" className={buttonVariants({ className: "mt-4" })}>
            Create Post
          </Link>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardContent className="pt-6 flex-1">
              <Link href={`/blog/${post.id}`}>
                <h2 className="text-2xl font-bold hover:text-primary mb-2 line-clamp-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {post.body}
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Link
                className={buttonVariants({
                  variant: "default",
                  className: "flex-1",
                })}
                href={`/blog/${post.id}`}
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">Failed to load posts. Please log in.</p>
      </div>
    );
  }
}



function SkeletonLoadingUi() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/" />
          </div>
        </div>
      ))}
    </div>
  );
}