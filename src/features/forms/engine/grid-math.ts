export type GridMode = 'mobile' | 'tablet' | 'desktop';

export interface GridColumnProps {
  mobileColumns?: string | number;
  tabletColumns?: string | number;
  desktopColumns?: string | number;
}

export interface GridSpanProps {
  mobileSpan?: string | number;
  tabletSpan?: string | number;
  desktopSpan?: string | number;
}

export const GRID_MAX_COLUMNS = 12;

function toPositiveInteger(value: unknown, fallback = 1) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : fallback;
}

export function resolveGridColumns(mode: GridMode, props: GridColumnProps) {
  const value =
    mode === 'mobile'
      ? props.mobileColumns
      : mode === 'tablet'
        ? props.tabletColumns
        : props.desktopColumns;
  return Math.min(GRID_MAX_COLUMNS, toPositiveInteger(value));
}

export function resolveGridSpan(mode: GridMode, props: GridSpanProps) {
  const value =
    mode === 'mobile' ? props.mobileSpan : mode === 'tablet' ? props.tabletSpan : props.desktopSpan;
  return toPositiveInteger(value);
}

export function clampGridSpan(span: number, columns: number) {
  return Math.min(Math.max(1, span), Math.max(1, columns));
}
