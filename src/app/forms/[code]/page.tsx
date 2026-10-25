import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadFileFormSchemas } from '@/features/forms/infrastructure/file-form-loader';
import { FileFormViewer } from '@/features/forms/ui/file-form-viewer';

export const metadata: Metadata = { title: 'نمایش فرم' };

export default async function FormViewerPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!code || code.length > 120 || code.includes('/') || code.includes('\\')) notFound();
  const schemas = await loadFileFormSchemas();

  return (
    <main className="grid gap-4">
      <h1 className="text-xl font-semibold">نمایش فرم</h1>
      <FileFormViewer code={code} schemas={schemas} />
    </main>
  );
}
