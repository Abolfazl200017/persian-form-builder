'use client';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
export function CreateFormButton() {
  return (
    <Link
      href="/forms/new"
      className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-95"
    >
      <PlusIcon className="size-[18px]" />
      ایجاد فرم
    </Link>
  );
}
