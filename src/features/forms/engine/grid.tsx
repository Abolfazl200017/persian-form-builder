'use client';

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  clampGridSpan,
  resolveGridColumns,
  resolveGridSpan,
  type GridColumnProps,
  type GridMode,
  type GridSpanProps,
} from './grid-math';

interface GridContextValue {
  mode: GridMode;
  columns: number;
}

const GridContext = createContext<GridContextValue | null>(null);

function readMode(container: Element | null): GridMode {
  if (container) {
    if (container.classList.contains('mobile')) return 'mobile';
    if (container.classList.contains('tablet')) return 'tablet';
    return 'desktop';
  }
  if (typeof window === 'undefined') return 'desktop';
  if (window.innerWidth < 600) return 'mobile';
  if (window.innerWidth < 900) return 'tablet';
  return 'desktop';
}

/** Reads the designer's desktop/tablet/mobile mode from the form container class. */
function useDesignerMode(ref: RefObject<HTMLElement | null>) {
  const [mode, setMode] = useState<GridMode>('desktop');

  useEffect(() => {
    const container = ref.current?.closest('.FE_FormContainer') ?? null;
    const update = () => setMode(readMode(container));
    update();

    const observer = container
      ? new MutationObserver(update)
      : null;
    if (container && observer) {
      observer.observe(container, { attributes: true, attributeFilter: ['class'] });
    }

    const mobileQuery = window.matchMedia('(max-width: 599px)');
    const tabletQuery = window.matchMedia('(max-width: 899px)');
    mobileQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);

    return () => {
      observer?.disconnect();
      mobileQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, [ref]);

  return mode;
}

export interface FormGridProps extends GridColumnProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Responsive CSS-grid container. Column count follows the designer device mode. */
export const FormGrid = forwardRef<HTMLDivElement, FormGridProps>(function FormGrid(
  { children, mobileColumns, tabletColumns, desktopColumns, className, style },
  forwardedRef,
) {
  const localRef = useRef<HTMLDivElement>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );
  const mode = useDesignerMode(localRef);
  const columns = resolveGridColumns(mode, {
    mobileColumns,
    tabletColumns,
    desktopColumns,
  });
  const contextValue = useMemo(() => ({ mode, columns }), [mode, columns]);

  return (
    <GridContext.Provider value={contextValue}>
      <div
        ref={setRef}
        className={['fe-grid', className].filter(Boolean).join(' ')}
        style={{
          ...style,
          width: '100%',
          minWidth: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: '16px',
          alignItems: 'start',
        }}
      >
        {children}
      </div>
    </GridContext.Provider>
  );
});

/** Applies the current device's column span to the nearest grid item wrapper. */
export function useGridItem<T extends HTMLElement>(
  ref: RefObject<T | null>,
  isContainer: boolean,
  spans: GridSpanProps,
) {
  const grid = useContext(GridContext);
  const { mobileSpan, tabletSpan, desktopSpan } = spans;

  useLayoutEffect(() => {
    if (!grid) return;
    const root = ref.current;
    if (!root) return;

    // Walk to the grid item without assuming FormEngine's wrapper class. Inputs
    // nested inside another layout container keep that container's span.
    let item: HTMLElement | null = root;
    while (item?.parentElement) {
      const parent: HTMLElement = item.parentElement;
      if (parent.classList.contains('fe-grid')) {
        if (!isContainer && item === root) return;
        break;
      }
      if (parent.hasAttribute('data-fe-grid-container')) return;
      item = parent;
    }
    if (!item?.parentElement?.classList.contains('fe-grid')) return;

    const span = clampGridSpan(
      resolveGridSpan(grid.mode, { mobileSpan, tabletSpan, desktopSpan }),
      grid.columns,
    );
    item.style.setProperty('grid-column', `span ${span}`);
    item.style.setProperty('min-width', '0');

    return () => {
      item.style.removeProperty('grid-column');
      item.style.removeProperty('min-width');
    };
  }, [grid, ref, isContainer, mobileSpan, tabletSpan, desktopSpan]);
}
