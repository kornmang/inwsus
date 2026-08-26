import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Trash(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V7" />
      <path d="M6.5 7 7.3 19a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </IconBase>
  );
}
