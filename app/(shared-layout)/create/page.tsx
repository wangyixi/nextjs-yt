"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/actions/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "@/app/schemas/post";
import { Loader2 } from "lucide-react";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function CreateRoute() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const form = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      body: "",
      title: "",
    },
  });

  function onSubmit(values: z.infer<typeof createPostSchema>) {
    startTransition(async () => {
      try {
        await createPost({
          title: values.title,
          body: values.body,
        });

        setMessage({ text: "Create success! Redirecting to blog...", type: "success" });
        form.reset();
        setTimeout(() => router.push("/blog"), 500);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Create failed";
        setMessage({ text: errorMessage, type: "error" });
      }
    });
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create Post
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Share your thoughts with the big world
        </p>
      </div>

      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article</CardTitle>
          <CardDescription>Create a new blog article</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {message ? (
              <div
                className={`pointer-events-none fixed right-4 top-4 z-50 w-full max-w-sm rounded-2xl border px-4 py-4 shadow-xl transition duration-300 ${
                  message.type === "success"
                    ? "border-green-400 bg-emerald-50 text-emerald-900"
                    : "border-red-400 bg-rose-50 text-rose-900"
                }`}
                role="status"
              >
                <p className="font-semibold mb-1">
                  {message.type === "success" ? "Success" : "Error"}
                </p>
                <p className="text-sm leading-6">{message.text}</p>
              </div>
            ) : null}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup className="gap-y-4">
              <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="super cool title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="body"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Super cool blog content"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Create Post</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
