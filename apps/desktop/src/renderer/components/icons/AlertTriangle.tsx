import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function AlertTriangle(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 3.5 21.5 19.5H2.5L12 3.5Z" />
      <path d="M12 9.75v4.5" />
      <path d="M12 17.25h.01" />
    </IconBase>
  );
}
