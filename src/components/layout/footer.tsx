import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} PropertyLink. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-sm hover:underline" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
