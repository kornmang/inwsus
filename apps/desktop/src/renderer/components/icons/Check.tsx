import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Check(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </IconBase>
  );
}
