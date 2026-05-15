import { Suspense } from "react";
import { getPostById } from "@/actions/post";
import { Card, CardContent } from "@/components/ui/card";
import { CommentSection } from "@/components/web/CommentSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ postId: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { postId } = await params;

  return (
    <div className="py-12">
      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogPost postId={postId} />
      </Suspense>
    </div>
  );
}

async function LoadBlogPost({ postId }: { postId: string }) {
  try {
    const post = await getPostById(postId);

    if (!post) {
      return (
        <div className="max-w-3xl mx-auto">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-900 mb-4">Post not found.</p>
              <Link href="/blog" className={buttonVariants()}>
                Back to Blog
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <article className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.createdAt?.toISOString()}>
              {post.createdAt?.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        {post.imageUrl ? (
          <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="h-[420px] w-full object-cover"
            />
          </div>
        ) : null}

        <Card>
          <CardContent className="prose prose-lg max-w-none pt-6">
            <p className="whitespace-pre-wrap leading-relaxed text-base">
              {post.body}
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />
        <CommentSection initialComments={post.comments || []} />

        <div className="mt-8">
          <Link href="/blog" className={buttonVariants()}>
            ← Back to Blog
          </Link>
        </div>
      </article>
      
    );
  } catch (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-900 mb-4">
              Failed to load post. Please try again.
            </p>
            <Link href="/blog" className={buttonVariants()}>
              Back to Blog
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}

function SkeletonLoadingUi() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 space-y-4">
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
