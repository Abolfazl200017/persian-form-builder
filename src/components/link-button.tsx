import Link from 'next/link';
export function LinkButton({
  href,
  children,
  variant = 'default',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
}) {
  const style =
    variant === 'outline'
      ? 'glass-chrome border border-input hover:bg-white/40 dark:hover:bg-white/10'
      : variant === 'ghost'
        ? 'hover:bg-white/40 dark:hover:bg-white/10'
        : 'glass-button bg-primary text-primary-foreground hover:brightness-95';
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all ${style}`}
    >
      {children}
    </Link>
  );
}
