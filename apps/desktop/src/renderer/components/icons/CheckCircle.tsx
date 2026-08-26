import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function CheckCircle(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.25 11 14.75l4.5-5.5" />
    </IconBase>
  );
}
