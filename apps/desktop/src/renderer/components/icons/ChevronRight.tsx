import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function ChevronRight(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M8.5 5.5 15 12l-6.5 6.5" />
    </IconBase>
  );
}
