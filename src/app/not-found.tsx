import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="grid justify-items-start gap-4">
      <h1 className="text-2xl font-bold">صفحه پیدا نشد</h1>
      <Link
        href="/"
        className="inline-flex min-h-9 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}
