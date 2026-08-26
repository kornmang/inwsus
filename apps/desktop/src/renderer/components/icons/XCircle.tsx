import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function XCircle(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9 9l6 6" />
      <path d="M15 9l-6 6" />
    </IconBase>
  );
}
