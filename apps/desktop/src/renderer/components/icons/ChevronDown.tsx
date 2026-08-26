import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function ChevronDown(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M5.5 8.5 12 15l6.5-6.5" />
    </IconBase>
  );
}
