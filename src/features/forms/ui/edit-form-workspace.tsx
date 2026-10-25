'use client';

import { useEffect, useState } from 'react';
import { LocalFormRepository } from '../infrastructure/local-form-repository';
import { FormDesigner } from './form-designer';
import type { FileFormSchemas } from './file-form-types';

export function EditFormWorkspace({
  code,
  fileSchemas,
}: {
  code: string;
  fileSchemas: FileFormSchemas;
}) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const initialize = async () => {
      const repository = new LocalFormRepository(window.localStorage);
      let names = repository.listSync();
      for (const [fileCode, schema] of Object.entries(fileSchemas)) {
        if (!names.includes(fileCode)) {
          await repository.save(
            fileCode,
            typeof schema === 'string' ? schema : JSON.stringify(schema),
          );
          names = repository.listSync();
        }
      }
      if (cancelled) return;
      if (!names.includes(code)) setError(`فرم «${code}» پیدا نشد`);
      else setReady(true);
    };
    void initialize().catch(() => {
      if (!cancelled) setError(`بارگذاری فرم «${code}» انجام نشد`);
    });
    return () => {
      cancelled = true;
    };
  }, [code, fileSchemas]);

  if (error) return <p role="alert" className="text-destructive">{error}</p>;
  if (!ready)
    return <p className="text-sm text-muted-foreground">در حال بارگذاری فرم برای ویرایش…</p>;

  return <FormDesigner initialFormName={code} persistFormName={false} />;
}
