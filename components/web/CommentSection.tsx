"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { createComment, getCurrentUser } from "@/actions/post";
import { toast } from "sonner";

interface Comment {
  id: string;
  authorName: string;
  body: string;
  createdAt: Date;
}

export function CommentSection({
  initialComments,
}: {
  initialComments: Comment[];
}) {
  const params = useParams();
  const postId = params.postId as string;
  const [isPending, startTransition] = useTransition();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [user, setUser] = useState<{ name: string | null } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ body?: string }>({});

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoadingUser(false);
    };
    fetchUser();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!body.trim()) {
      newErrors.body = "Comment is required";
    } else if (body.length > 500) {
      newErrors.body = "Comment must be 500 characters or less";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.name) return;

    startTransition(async () => {
      try {
        const newComment = await createComment(postId, user.name!, body);
        setComments([
          {
            id: newComment.id,
            authorName: newComment.authorName,
            body: newComment.body,
            createdAt: newComment.createdAt,
          },
          ...comments,
        ]);
        setBody("");
        toast.success("Comment posted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to post comment");
      }
    });
  };

  if (isLoadingUser) {
    return <p>Loading...</p>;
  }

  if (!user?.name) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 border-b">
          <MessageSquare className="size-5" />
          <h2 className="text-xl font-bold">Comments</h2>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Please log in to post a comment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-900">{user.name}</p>
          </div>

          <Field>
            <FieldLabel>Comment</FieldLabel>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts"
            />
            {errors.body && (
              <p className="text-red-500 text-sm mt-1">{errors.body}</p>
            )}
          </Field>

          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <span>Post Comment</span>
            )}
          </Button>
        </form>
        <Separator />

        <section className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{comment.authorName}</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(comment.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {comment.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      </CardContent>
    </Card>
  );
}