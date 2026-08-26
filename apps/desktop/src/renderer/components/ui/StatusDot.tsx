import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import type { BadgeTone } from './Badge.js';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: BadgeTone;
  readonly label?: ReactNode;
  /** Gentle continuous opacity/scale breathing to signal ongoing activity (e.g. a busy agent). Respects prefers-reduced-motion. */
  readonly pulse?: boolean;
}

export function StatusDot({
  tone = 'neutral',
  label,
  pulse = false,
  className,
  ...rest
}: StatusDotProps): ReactElement {
  const classes = ['ui-status-dot'];
  if (className) {
    classes.push(className);
  }

  const dotClasses = [`ui-status-dot__dot`, `ui-status-dot__dot--${tone}`];
  if (pulse) {
    dotClasses.push('ui-status-dot__dot--pulse');
  }

  return (
    <span className={classes.join(' ')} {...rest}>
      <span className={dotClasses.join(' ')} aria-hidden="true" />
      {label ? <span className="ui-status-dot__label">{label}</span> : null}
    </span>
  );
}
