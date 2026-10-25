import type { Metadata } from 'next';
import { loadFileFormSchemas } from '@/features/forms/infrastructure/file-form-loader';
import { FormsList } from '@/features/forms/ui/forms-list';

export const metadata: Metadata = { title: 'فرم‌ها' };

export default async function FormsPage() {
  const fileSchemas = await loadFileFormSchemas();
  return <FormsList fileSchemas={fileSchemas} />;
}
