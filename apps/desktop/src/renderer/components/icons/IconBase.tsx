import type { ReactElement, ReactNode, SVGProps } from 'react';

/**
 * Shared props for every icon component in `components/icons/`.
 * - Omitting `title` renders the icon as decorative (`aria-hidden`).
 * - Passing `title` renders it as a meaningful graphic (`role="img"` + `aria-label`).
 */
export interface IconProps {
  readonly size?: number;
  readonly className?: string;
  readonly title?: string;
}

interface IconBaseProps extends IconProps {
  readonly children: ReactNode;
}

const DEFAULT_SIZE = 16;

/**
 * Renders the shared `<svg>` wrapper (viewBox, stroke, a11y attributes) used by
 * every icon in this folder. Icon components pass their own path data as children.
 */
export function IconBase({ size = DEFAULT_SIZE, className, title, children }: IconBaseProps): ReactElement {
  const a11yProps: SVGProps<SVGSVGElement> = title === undefined
    ? { 'aria-hidden': true, focusable: false }
    : { role: 'img', 'aria-label': title };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...a11yProps}
    >
      {children}
    </svg>
  );
}
