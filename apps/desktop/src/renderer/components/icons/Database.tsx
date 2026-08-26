import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Database(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3" />
    </IconBase>
  );
}
