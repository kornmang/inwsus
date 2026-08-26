import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

export interface SectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  readonly eyebrow?: ReactNode;
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly actions?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  className,
  ...rest
}: SectionHeadingProps): ReactElement {
  const classes = ['ui-section-heading'];
  if (className) {
    classes.push(className);
  }

  return (
    <div className={classes.join(' ')} {...rest}>
      <div className="ui-section-heading__text">
        {eyebrow ? <div className="ui-section-heading__eyebrow">{eyebrow}</div> : null}
        <h2 className="ui-section-heading__title">{title}</h2>
        {description ? (
          <div className="ui-section-heading__description">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="ui-section-heading__actions">{actions}</div> : null}
    </div>
  );
}
