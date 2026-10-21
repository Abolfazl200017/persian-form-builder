'use client';

import { useCallback, useMemo } from 'react';
import { FormBuilder } from '@react-form-builder/designer';
import { builderView } from '../engine/registry';
import { designerI18n } from '../engine/i18n';
import { InlineErrorWrapper } from '../engine/components';
import { validators } from '../engine/validators';
import { createDesignerStorage } from '../engine/storage-adapter';
import { MemoryFormRepository } from '../infrastructure/memory-form-repository';
import { NEW_FORM_NAME } from '../domain/new-form';
import { useThemeMode } from '@/theme/theme-mode-provider';

export default function DesignerRuntime() {
  const { mode } = useThemeMode();
  const repository = useMemo(() => new MemoryFormRepository(), []);
  const storage = useMemo(() => createDesignerStorage(repository), [repository]);
  const getForm = useCallback(
    (name?: string) => repository.load(name?.trim() || NEW_FORM_NAME),
    [repository],
  );

  return (
    <FormBuilder
      view={builderView}
      theme={mode}
      getForm={getForm}
      formName={NEW_FORM_NAME}
      formStorage={storage}
      persistFormName={false}
      i18n={designerI18n}
      defaultBuilderLanguage="fa-IR"
      defaultViewerLanguage="fa-IR"
      validators={validators}
      errorWrapper={InlineErrorWrapper}
      licenseKey={process.env.NEXT_PUBLIC_FORMENGINE_LICENSE_KEY || undefined}
      actions={{ submit: () => undefined }}
    />
  );
}
