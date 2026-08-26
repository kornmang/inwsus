import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Terminal(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9.5 10.5 12 7 14.5" />
      <path d="M12.5 14.5h4.5" />
    </IconBase>
  );
}
