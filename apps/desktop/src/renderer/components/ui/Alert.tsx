import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'title'> {
  readonly tone?: AlertTone;
  readonly icon?: ReactNode;
  readonly title?: ReactNode;
  readonly action?: ReactNode;
  readonly role?: 'status' | 'alert' | 'none';
}

export function Alert({
  tone = 'info',
  icon,
  title,
  action,
  role = 'status',
  className,
  children,
  ...rest
}: AlertProps): ReactElement {
  const classes = ['ui-alert', `ui-alert--${tone}`];
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')} role={role} {...rest}>
      {icon ? (
        <span className="ui-alert__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="ui-alert__content">
        {title ? <div className="ui-alert__title">{title}</div> : null}
        {children ? <div className="ui-alert__message">{children}</div> : null}
      </div>
      {action ? <div className="ui-alert__action">{action}</div> : null}
    </div>
  );
}
