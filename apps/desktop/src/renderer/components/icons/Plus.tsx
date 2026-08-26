import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Plus(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}
