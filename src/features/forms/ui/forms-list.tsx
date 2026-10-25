'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, CardContent } from '@/components/ui';
import { DEFAULT_MODAL_TEMPLATE_NAME, NEW_FORM_NAME } from '../domain/new-form';
import { SAMPLE_NAME } from '../domain/sample';
import { LocalFormRepository } from '../infrastructure/local-form-repository';
import type { FileFormSchemas } from './file-form-types';

export function FormsList({ fileSchemas }: { fileSchemas: FileFormSchemas }) {
  const [localNames, setLocalNames] = useState<string[]>([]);
  const [error, setError] = useState('');
  const fileNames = Object.keys(fileSchemas);
  const protectedForms = new Set([NEW_FORM_NAME, DEFAULT_MODAL_TEMPLATE_NAME, SAMPLE_NAME]);
  const refresh = useCallback(async () => {
    const repository = new LocalFormRepository(window.localStorage);
    setLocalNames(await repository.list());
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh().catch(() => setError('دریافت فهرست فرم‌ها انجام نشد'));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  const names = [...new Set([...fileNames, ...localNames])].sort((a, b) => a.localeCompare(b, 'fa'));

  async function removeForm(name: string) {
    try {
      await new LocalFormRepository(window.localStorage).remove(name);
      await refresh();
    } catch {
      setError('حذف فرم انجام نشد');
    }
  }

  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">فرم‌ها</h1>
          <p className="mt-1 text-sm text-muted-foreground">نمایش، ویرایش و مدیریت فرم‌های ذخیره‌شده</p>
        </div>
        <Link
          href="/forms/new"
          className="glass-button ms-auto inline-flex min-h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          ایجاد فرم
        </Link>
      </header>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {names.length === 0 ? (
        <Card className="border-dashed bg-transparent">
          <CardContent className="p-8 text-center text-muted-foreground">
            هنوز فرمی ساخته نشده است.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {names.map((name) => {
            const href = `/forms/${encodeURIComponent(name)}`;
            const isLocal = localNames.includes(name);
            return (
              <Card key={name}>
                <CardContent className="flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-semibold">{name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {isLocal ? 'ذخیره‌شده در این مرورگر' : 'فایل نمونه'}
                    </p>
                  </div>
                  <Link
                    href={href}
                    className="glass-chrome inline-flex min-h-8 items-center rounded-md border border-input px-3 py-1.5 text-sm"
                  >
                    نمایش
                  </Link>
                  <Link
                    href={`${href}/edit`}
                    className="glass-chrome inline-flex min-h-8 items-center rounded-md border border-input px-3 py-1.5 text-sm"
                  >
                    ویرایش
                  </Link>
                  {isLocal && !Object.hasOwn(fileSchemas, name) && !protectedForms.has(name) && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => void removeForm(name)}
                    >
                      حذف
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
