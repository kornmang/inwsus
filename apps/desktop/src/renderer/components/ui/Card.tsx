import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  readonly eyebrow?: ReactNode;
  readonly title?: ReactNode;
  readonly description?: ReactNode;
  readonly actions?: ReactNode;
  readonly compact?: boolean;
}

export function Card({
  eyebrow,
  title,
  description,
  actions,
  compact = false,
  className,
  children,
  ...rest
}: CardProps): ReactElement {
  const classes = ['ui-card'];
  if (compact) {
    classes.push('ui-card--compact');
  }
  if (className) {
    classes.push(className);
  }

  const hasHeader = Boolean(eyebrow ?? title ?? description ?? actions);

  return (
    <div className={classes.join(' ')} {...rest}>
      {hasHeader ? (
        <div className="ui-card__header">
          <div className="ui-card__header-text">
            {eyebrow ? <div className="ui-card__eyebrow">{eyebrow}</div> : null}
            {title ? <div className="ui-card__title">{title}</div> : null}
            {description ? (
              <div className="ui-card__description">{description}</div>
            ) : null}
          </div>
          {actions ? <div className="ui-card__actions">{actions}</div> : null}
        </div>
      ) : null}
      {children ? <div className="ui-card__body">{children}</div> : null}
    </div>
  );
}
