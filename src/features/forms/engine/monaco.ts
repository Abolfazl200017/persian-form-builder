'use client';
import { loader } from '@monaco-editor/react';

/** Must run before the designer module is imported: it calls loader.init() at module scope. */
export function configureMonaco() {
  const path = process.env.NEXT_PUBLIC_MONACO_VS_PATH || '/vendor/monaco/0.55.1/vs';
  const url = new URL(path, window.location.origin);
  if (url.origin !== window.location.origin) {
    throw new Error('Monaco assets must be served from this application’s origin.');
  }
  loader.config({ paths: { vs: url.href } });
}
