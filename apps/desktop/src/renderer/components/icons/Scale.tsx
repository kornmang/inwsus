import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Scale(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 3v3" />
      <path d="M6 6h12" />
      <path d="M6 6 3.5 12a2.6 2.6 0 0 0 5 0L6 6Z" />
      <path d="M18 6l-2.5 6a2.6 2.6 0 0 0 5 0L18 6Z" />
      <path d="M8.5 21h7" />
      <path d="M12 9v12" />
    </IconBase>
  );
}
