import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'accent';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: BadgeTone;
  readonly icon?: ReactNode;
}

export function Badge({
  tone = 'neutral',
  icon,
  className,
  children,
  ...rest
}: BadgeProps): ReactElement {
  const classes = ['ui-badge', `ui-badge--${tone}`];
  if (className) {
    classes.push(className);
  }

  return (
    <span className={classes.join(' ')} {...rest}>
      {icon ? (
        <span className="ui-badge__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="ui-badge__label">{children}</span>
    </span>
  );
}
