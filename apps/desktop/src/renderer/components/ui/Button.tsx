import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly icon?: ReactNode;
  readonly loading?: boolean;
  readonly type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  type = 'button',
  disabled = false,
  className,
  children,
  ...rest
}: ButtonProps): ReactElement {
  const classes = ['ui-button', `ui-button--${variant}`, `ui-button--${size}`];
  if (loading) {
    classes.push('ui-button--loading');
  }
  if (className) {
    classes.push(className);
  }

  return (
    <button
      type={type}
      className={classes.join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="ui-button__spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="ui-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children ? <span className="ui-button__label">{children}</span> : null}
    </button>
  );
}
