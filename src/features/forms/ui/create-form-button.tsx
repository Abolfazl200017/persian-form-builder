'use client';
import Link from 'next/link';
import { PlusIcon } from '@/components/icons';
export function CreateFormButton() {
  return (
    <Link
      href="/forms/new"
      className="glass-button inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-95"
    >
      <PlusIcon className="size-[18px]" />
      ایجاد فرم
    </Link>
  );
}
