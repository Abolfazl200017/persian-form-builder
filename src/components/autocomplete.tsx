'use client';

import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui';

export interface AutocompleteOption {
  label: string;
  value: string;
}
export interface AutocompleteProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> {
  value?: string;
  options: Array<string | AutocompleteOption>;
  onChange: (value: string) => void;
  clearable?: boolean;
  clearLabel?: string;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(function Autocomplete(
  {
    value = '',
    options,
    onChange,
    clearable = true,
    clearLabel = 'پاک کردن مقدار',
    className = '',
    id,
    onFocus,
    onBlur,
    onKeyDown,
    ...props
  },
  forwardedRef,
) {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-input`;
  const listId = `${inputId}-listbox`;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const localRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const setRef = (node: HTMLInputElement | null) => {
    localRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  const normalized = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  );
  const selectedLabel = normalized.find((option) => option.value === value)?.label ?? value;
  const inputValue = editing ? query : selectedLabel;
  const filtered = normalized.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  const expanded = open && !props.disabled;
  const selectedActiveIndex = filtered.length ? activeIndex % filtered.length : 0;

  useLayoutEffect(() => {
    if (!expanded) return;

    const positionMenu = () => {
      const input = localRef.current;
      const menu = menuRef.current;
      if (!input || !menu) return;

      const rect = input.getBoundingClientRect();
      const gap = 8;
      const viewportPadding = 8;
      const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
      const spaceAbove = rect.top - gap - viewportPadding;
      const placeAbove = spaceBelow < 160 && spaceAbove > spaceBelow;
      const availableHeight = Math.max(96, placeAbove ? spaceAbove : spaceBelow);

      Object.assign(menu.style, {
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        maxHeight: `${Math.min(240, availableHeight)}px`,
        top: placeAbove ? 'auto' : `${rect.bottom + gap}px`,
        bottom: placeAbove ? `${window.innerHeight - rect.top + gap}px` : 'auto',
        visibility: 'visible',
      });
    };

    positionMenu();
    window.addEventListener('resize', positionMenu);
    window.addEventListener('scroll', positionMenu, true);
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(positionMenu) : undefined;
    if (localRef.current) observer?.observe(localRef.current);

    return () => {
      window.removeEventListener('resize', positionMenu);
      window.removeEventListener('scroll', positionMenu, true);
      observer?.disconnect();
    };
  }, [expanded, filtered.length]);

  return (
    <div className="relative min-w-0">
      <Input
        {...props}
        ref={setRef}
        id={inputId}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={
          expanded && filtered.length ? `${listId}-option-${selectedActiveIndex}` : undefined
        }
        autoComplete="off"
        placeholder={props.placeholder ?? 'جست‌وجو یا انتخاب کنید'}
        className={`${clearable && value ? 'pe-10' : ''} ${className}`}
        value={inputValue}
        onFocus={(event) => {
          onFocus?.(event);
          setEditing(false);
          setQuery('');
          setActiveIndex(0);
          setOpen(true);
          if (value) event.currentTarget.select();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          setEditing(false);
          setQuery('');
          setOpen(false);
        }}
        onChange={(event) => {
          setEditing(true);
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;
          if (event.key === 'ArrowDown' && filtered.length) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index + 1) % filtered.length);
          } else if (event.key === 'ArrowUp' && filtered.length) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index - 1 + filtered.length) % filtered.length);
          } else if (event.key === 'Enter' && expanded && filtered.length > 0) {
            event.preventDefault();
            onChange(filtered[selectedActiveIndex]?.value ?? filtered[0].value);
            setEditing(false);
            setQuery('');
            setOpen(false);
          } else if (event.key === 'Escape') {
            setOpen(false);
            setEditing(false);
            setQuery('');
          }
        }}
      />
      {clearable && value && !props.disabled && (
        <button
          type="button"
          aria-label={clearLabel}
          className="absolute end-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            onChange('');
            setEditing(true);
            setQuery('');
            setActiveIndex(0);
            setOpen(true);
            localRef.current?.focus();
          }}
        >
          <svg
            viewBox="0 0 20 20"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
          </svg>
        </button>
      )}
      {expanded &&
        typeof document !== 'undefined' &&
        createPortal(
          <ul
            ref={menuRef}
            id={listId}
            role="listbox"
            className="glass-panel fixed z-80 max-h-60 overflow-auto p-1.5 shadow-xl"
            style={{ visibility: 'hidden', top: 0, left: 0, width: 0 }}
          >
            {filtered.length === 0 && (
              <li
                role="presentation"
                className="px-3 py-3 text-center text-sm text-muted-foreground"
              >
                گزینه‌ای یافت نشد
              </li>
            )}
            {filtered.map((option, index) => (
              <li key={`${option.value}-${index}`} role="presentation">
                <button
                  id={`${listId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onChange(option.value);
                    setEditing(false);
                    setQuery('');
                    setOpen(false);
                    localRef.current?.focus();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${index === selectedActiveIndex ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-primary/5'}`}
                >
                  {option.label}
                  {option.value === value && (
                    <span aria-hidden="true" className="text-primary">
                      ✓
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
});
