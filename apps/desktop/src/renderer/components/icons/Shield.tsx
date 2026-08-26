import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Shield(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 3 19 6v5.5c0 5-3 8-7 9.5-4-1.5-7-4.5-7-9.5V6Z" />
    </IconBase>
  );
}
