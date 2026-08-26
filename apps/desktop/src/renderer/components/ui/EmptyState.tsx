import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  readonly icon?: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly action?: ReactNode;
  /** Reduced padding for an empty state nested inside an already-bordered
   * card section (e.g. a small "no items yet" row list) instead of a
   * standalone panel. */
  readonly compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
  className,
  ...rest
}: EmptyStateProps): ReactElement {
  const classes = ['ui-empty-state'];
  if (compact) {
    classes.push('ui-empty-state--compact');
  }
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')} {...rest}>
      {icon ? (
        <div className="ui-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div className="ui-empty-state__title">{title}</div>
      {description ? <div className="ui-empty-state__description">{description}</div> : null}
      {action ? <div className="ui-empty-state__action">{action}</div> : null}
    </div>
  );
}
