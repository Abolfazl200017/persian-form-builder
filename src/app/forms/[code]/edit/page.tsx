import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadFileFormSchemas } from '@/features/forms/infrastructure/file-form-loader';
import { EditFormWorkspace } from '@/features/forms/ui/edit-form-workspace';

export const metadata: Metadata = { title: 'ویرایش فرم' };

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!code || code.length > 120 || code.includes('/') || code.includes('\\')) notFound();
  const fileSchemas = await loadFileFormSchemas();

  return (
    <main className="grid gap-4">
      <h1 className="text-xl font-semibold">ویرایش فرم: {code}</h1>
      <EditFormWorkspace code={code} fileSchemas={fileSchemas} />
    </main>
  );
}
