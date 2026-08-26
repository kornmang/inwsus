import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Download(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 3v12" />
      <path d="M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 18.5v1a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1" />
    </IconBase>
  );
}
