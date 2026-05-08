import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from '@/components/web/theme-toggle';


export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-5 left-5">
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft className="size-4" />
          Go Back
        </Link>
      </div>
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <Link className={buttonVariants({ variant: 'default' })} href="/auth/sign-up">
          Sign up
        </Link>
        <Link className={buttonVariants({ variant: 'outline' })} href="/auth/login">
          Login
        </Link>
        <ModeToggle />
      </div>
      
      <div className="w-full max-w-md mx-auto">{children}</div>
    </div>
  );
}