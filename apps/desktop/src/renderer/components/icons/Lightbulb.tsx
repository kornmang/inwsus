import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Lightbulb(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.45 1.1 1.2 1.1 2.2h5c0-1 .5-1.75 1.1-2.2A6 6 0 0 0 12 3Z" />
    </IconBase>
  );
}
