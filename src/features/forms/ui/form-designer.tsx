'use client';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { CollapseIcon, ExpandIcon } from '@/components/icons';
import { Button } from '@/components/ui';
import { EngineBoundary } from './engine-boundary';
const DesignerRuntime = dynamic(
  async () => {
    const { configureMonaco } = await import('../engine/monaco');
    configureMonaco();
    return import('./designer-runtime');
  },
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-content-center gap-3 text-center text-sm text-muted-foreground">
        <span className="mx-auto size-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        در حال بارگذاری طراح…
      </div>
    ),
  },
);
export function FormDesigner({
  onSchemaChange,
}: {
  onSchemaChange?: (formSchema: string) => void;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const exitButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!fullscreen) return;
    exitButtonRef.current?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('.rs-modal')) setFullscreen(false);
    };
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('keydown', key);
      document.body.style.overflow = old;
    };
  }, [fullscreen]);
  return (
    <section
      aria-labelledby="designer-heading"
      className={
        fullscreen ? 'fixed inset-0 z-[1200] flex flex-col gap-2 bg-background p-2 md:p-3' : ''
      }
    >
      <div className={`mb-3 flex items-center gap-2 ${fullscreen ? 'hidden' : ''}`}>
        <h2 id="designer-heading" className="text-lg font-semibold">
          طراح فرم
        </h2>
        <Button variant="outline" size="sm" className="ms-auto" onClick={() => setFullscreen(true)}>
          <ExpandIcon className="size-4" />
          تمام‌صفحه
        </Button>
      </div>
      {fullscreen && (
        <div className="flex items-center gap-2 px-1">
          <h2 className="font-semibold">طراح فرم</h2>
          <Button
            ref={exitButtonRef}
            variant="outline"
            size="sm"
            className="ms-auto"
            onClick={() => setFullscreen(false)}
          >
            <CollapseIcon className="size-4" />
            حالت پنجره
          </Button>
        </div>
      )}
      <EngineBoundary>
        <div
          className={`engine-host min-w-0 overflow-hidden rounded-md border border-border bg-card p-2 ${fullscreen ? 'min-h-0 flex-1' : 'h-[760px] md:h-[calc(100dvh-420px)] md:min-h-[560px]'}`}
          dir="rtl"
        >
          <DesignerRuntime onSchemaChange={onSchemaChange} />
        </div>
      </EngineBoundary>
    </section>
  );
}
