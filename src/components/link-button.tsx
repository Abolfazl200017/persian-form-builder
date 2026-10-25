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
      ? 'border border-input bg-background hover:bg-muted'
      : variant === 'ghost'
        ? 'hover:bg-muted'
        : 'bg-primary text-primary-foreground hover:brightness-95';
  return (
    <Link
      href={href}
      className={`inline-flex min-h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${style}`}
    >
      {children}
    </Link>
  );
}
