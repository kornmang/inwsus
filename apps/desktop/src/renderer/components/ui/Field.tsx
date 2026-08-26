import { useId, type ReactElement, type ReactNode } from 'react';

export interface FieldProps {
  readonly label: ReactNode;
  readonly hint?: ReactNode;
  readonly error?: ReactNode;
  readonly htmlFor?: string;
  readonly required?: boolean;
  readonly className?: string;
  readonly children: (ids: { readonly controlId: string; readonly describedBy: string | undefined }) => ReactNode;
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  required = false,
  className,
  children,
}: FieldProps): ReactElement {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter((id): id is string => Boolean(id)).join(' ') || undefined;

  const classes = ['ui-field'];
  if (error) {
    classes.push('ui-field--error');
  }
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')}>
      <label className="ui-field__label" htmlFor={controlId}>
        {label}
        {required ? (
          <span className="ui-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <div className="ui-field__control">{children({ controlId, describedBy })}</div>
      {hint ? (
        <div className="ui-field__hint" id={hintId}>
          {hint}
        </div>
      ) : null}
      {error ? (
        <div className="ui-field__error" id={errorId} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}
