'use client';

import { useCallback, useMemo } from 'react';
import { FormViewer, type CustomActions } from '@react-form-builder/core';
import { createBuilderView } from '../engine/registry';
import { InlineErrorWrapper } from '../engine/components';
import { validators } from '../engine/validators';
import { parseFormDocument, type FormNode } from '../domain/form-document';

export type FormSchemaLoader = (name?: string) => string | Promise<string>;

function containsModal(node: FormNode): boolean {
  return node.type === 'Modal' || Boolean(node.children?.some(containsModal));
}

export function FormViewerPanel({
  formName,
  loadForm,
  templateNames = [],
  initialData,
  actions,
}: {
  formName: string;
  loadForm: FormSchemaLoader;
  templateNames?: string[];
  initialData?: Record<string, unknown>;
  actions?: CustomActions;
}) {
  const view = useMemo(() => createBuilderView(templateNames), [templateNames]);
  const resolvedActions = useMemo(() => ({ submit: () => undefined, ...actions }), [actions]);
  const getForm = useCallback(
    async (name?: string) => {
      const json = await loadForm(name ?? formName);
      const document = parseFormDocument(json);
      if (containsModal(document.form) && !document.modalType) {
        const modalType = view
          .filterModels((model) => model.hasComponentRole('modal'))
          .map((model) => model.type)[0];
        if (modalType) document.modalType = modalType;
      }
      const normalizedJson = JSON.stringify(document);
      parseFormDocument(normalizedJson);
      return normalizedJson;
    },
    [formName, loadForm, view],
  );

  return (
    <div className="engine-host glass-frame min-w-0 p-3 md:p-5" dir="rtl">
      <FormViewer
        view={view}
        formName={formName}
        getForm={getForm}
        initialData={initialData}
        language="fa-IR"
        validators={validators}
        errorWrapper={InlineErrorWrapper}
        actions={resolvedActions}
      />
    </div>
  );
}
