import type { SVGProps } from 'react';
type IconProps = SVGProps<SVGSVGElement>;
function Icon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const FormIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 17h4" />
  </Icon>
);
export const SunIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
  </Icon>
);
export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
  </Icon>
);
export const ExpandIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 4H4v5m11-5h5v5M9 20H4v-5m11 5h5v-5" />
  </Icon>
);
export const CollapseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9h5V4m11 5h-5V4M4 15h5v5m11-5h-5v5" />
  </Icon>
);
