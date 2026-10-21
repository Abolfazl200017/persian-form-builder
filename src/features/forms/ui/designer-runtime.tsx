'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { FormBuilder } from '@react-form-builder/designer';
import { builderView } from '../engine/registry';
import { designerI18n } from '../engine/i18n';
import { InlineErrorWrapper } from '../engine/components';
import { validators } from '../engine/validators';
import { createDesignerStorage } from '../engine/storage-adapter';
import { MemoryFormRepository } from '../infrastructure/memory-form-repository';
import { NEW_FORM_NAME } from '../domain/new-form';
import { useThemeMode } from '@/theme/theme-mode-provider';

/** Strings that FormEngine renders outside its translation system. */
const VENDOR_TEXT: Record<string, string> = {
  'Default Error Message': 'پیام خطای پیش‌فرض',
  'The name of the form and options are not specified, set at least one value to display the form':
    'نام فرم و گزینه‌ها مشخص نشده‌اند؛ برای نمایش فرم حداقل یک مقدار تعیین کنید.',
};

/** The tree renders model names directly, so scope these to tree rows only. */
const TREE_TEXT: Record<string, string> = {
  EmbeddedForm: 'فرم جاسازی‌شده',
  Repeater: 'تکرارشونده',
  Slot: 'جایگاه',
  Modal: 'مودال',
  DefaultErrorMessage: 'پیام خطای پیش‌فرض',
  Tooltip: 'راهنما',
};

function translateTextNode(node: Text) {
  const element = node.parentElement;
  if (!element || element.closest('.monaco-editor')) return;
  const raw = node.nodeValue ?? '';
  const trimmed = raw.trim();
  const treeName = element.closest('[class*="nodeItem"], [class*="listItem"]')
    ? TREE_TEXT[trimmed]
    : undefined;
  const replacement =
    VENDOR_TEXT[trimmed] ??
    treeName ??
    (trimmed === 'Select' && element.classList.contains('rs-picker-toggle-placeholder')
      ? 'انتخاب'
      : undefined);
  if (replacement) node.nodeValue = raw.replace(trimmed, replacement);
}

function translateSubtree(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text);
    return;
  }
  if (!(root instanceof Element) || root.closest('.monaco-editor')) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateTextNode(node as Text);
    node = walker.nextNode();
  }
}

function useVendorTranslations() {
  useEffect(() => {
    const host = document.querySelector('.engine-host');
    if (!host) return;
    translateSubtree(host);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') translateTextNode(record.target as Text);
        else record.addedNodes.forEach(translateSubtree);
      }
    });
    observer.observe(host, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);
}

export default function DesignerRuntime({
  onSchemaChange,
}: {
  onSchemaChange?: (formSchema: string) => void;
}) {
  const { mode } = useThemeMode();
  useVendorTranslations();
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
      onFormSchemaChange={onSchemaChange}
      licenseKey={process.env.NEXT_PUBLIC_FORMENGINE_LICENSE_KEY || undefined}
      actions={{ submit: () => undefined }}
    />
  );
}
