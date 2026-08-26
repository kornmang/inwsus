import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Info(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <path d="M12 7.5h.01" />
    </IconBase>
  );
}
