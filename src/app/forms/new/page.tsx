import type { Metadata } from 'next';
import { AddFormView } from '@/features/forms/ui/add-form-view';

export const metadata: Metadata = { title: 'افزودن فرم' };

export default function AddFormPage() {
  return <AddFormView />;
}
