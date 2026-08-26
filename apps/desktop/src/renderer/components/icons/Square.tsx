import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Square(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
    </IconBase>
  );
}
