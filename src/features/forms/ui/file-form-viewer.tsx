'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { LocalFormRepository } from '../infrastructure/local-form-repository';
import type { FileFormSchemas } from './file-form-types';

const FormViewerPanel = dynamic(
  () => import('./form-viewer-panel').then((module) => module.FormViewerPanel),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">در حال بارگذاری نمایش فرم…</p>,
  },
);

export function FileFormViewer({
  code,
  schemas,
}: {
  code: string;
  schemas: FileFormSchemas;
}) {
  const [repository, setRepository] = useState<LocalFormRepository | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(
      () => setRepository(new LocalFormRepository(window.localStorage)),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);
  const templateNames = useMemo(
    () => [...new Set([...Object.keys(schemas), ...(repository?.listSync() ?? [])])],
    [repository, schemas],
  );
  const loadForm = useCallback(
    async (name?: string) => {
      const formName = name ?? code;
      if (repository?.listSync().includes(formName)) return repository.load(formName);
      const schema = schemas[formName];
      if (!schema) throw new Error(`فرم «${formName}» پیدا نشد`);
      return typeof schema === 'string' ? schema : JSON.stringify(schema);
    },
    [code, repository, schemas],
  );

  if (!repository) return <p className="text-sm text-muted-foreground">در حال آماده‌سازی نمایش فرم…</p>;

  return <FormViewerPanel formName={code} loadForm={loadForm} templateNames={templateNames} />;
}
