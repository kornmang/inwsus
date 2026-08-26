import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Loader(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M4.9 4.9l2.1 2.1" />
      <path d="M17 17l2.1 2.1" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M4.9 19.1l2.1-2.1" />
      <path d="M17 7l2.1-2.1" />
    </IconBase>
  );
}
