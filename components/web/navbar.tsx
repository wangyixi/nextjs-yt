import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ModeToggle } from './theme-toggle';

export function Navbar() {
  return (
    <nav className="w-full py-5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-3xl font-bold">
          <h1 className="text-3xl font-bold">
            Next<span className="text-blue-500">Pro</span>
          </h1>
        </Link>
 
        <div className="flex items-center gap-2">
          <Link className={`buttonVariants({ variant: 'ghost' }) text-gray-600 hover:text-gray-900`} href="/">
            Home
          </Link>
          <Link className={`buttonVariants({ variant: 'ghost' }) text-gray-600 hover:text-gray-900`} href="/blog">
            Blog
          </Link>
          <Link className={`buttonVariants({ variant: 'ghost' }) text-gray-600 hover:text-gray-900`} href="/create">
            Create
          </Link>
        </div>
      </div>
       <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: 'default' })} href="/auth/sign-up">
            Sign up
          </Link>
          <Link className={buttonVariants({ variant: 'outline' })} href="/auth/login">
            Login
          </Link>
          <ModeToggle />
        </div>
    </nav>
  );
}
