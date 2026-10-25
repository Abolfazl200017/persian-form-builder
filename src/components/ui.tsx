import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type HTMLAttributes,
  type LabelHTMLAttributes,
} from 'react';

const focus =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background';
export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'default' | 'sm';
  }
>(function Button({ className = '', variant = 'default', size = 'default', ...props }, ref) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:brightness-95',
    outline: 'border border-input bg-background hover:bg-muted',
    ghost: 'hover:bg-muted',
    destructive: 'bg-destructive text-white hover:brightness-95',
  };
  const sizes = { default: 'min-h-9 px-4 py-2', sm: 'min-h-8 px-3 py-1.5 text-sm' };
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${focus} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});
export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${focus} ${className}`}
      {...props}
    />
  );
}
export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${focus} ${className}`}
      {...props}
    />
  );
}
export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ${focus} ${className}`}
      {...props}
    />
  );
}
export function Label({ className = '', ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}
export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    />
  );
}
export function CardContent({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 ${className}`} {...props} />;
}
export function Alert({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="alert"
      className={`rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-foreground ${className}`}
      {...props}
    />
  );
}
export function Separator({ className = '' }: { className?: string }) {
  return <div role="separator" className={`h-px w-full bg-border ${className}`} />;
}
