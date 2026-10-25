import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui';
import { FormIcon } from '@/components/icons';
import { CreateFormButton } from '@/features/forms/ui/create-form-button';
export const metadata: Metadata = { title: 'فرم‌ها' };
export default function FormsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">فرم‌ها</h1>
          <p className="mt-1 text-muted-foreground">فرم‌های سازمان را در یک‌جا بسازید.</p>
        </div>
        <CreateFormButton />
      </div>
      <Card className="border-dashed bg-transparent">
        <CardContent className="grid justify-items-center gap-3 px-6 py-16 text-center md:py-24">
          <span className="grid size-12 place-items-center rounded-md bg-muted text-primary">
            <FormIcon className="size-7" />
          </span>
          <h2 className="text-lg font-semibold">هنوز فرمی ساخته نشده است</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            با دکمه «ایجاد فرم» اولین فرم را بسازید؛ نام، کد و نوع فرم را تعیین می‌کنید و سپس با
            طراح بصری ادامه می‌دهید.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
