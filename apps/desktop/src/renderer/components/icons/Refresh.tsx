import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Refresh(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 4v5h-5" />
    </IconBase>
  );
}
