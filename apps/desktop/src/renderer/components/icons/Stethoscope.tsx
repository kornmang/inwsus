import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Stethoscope(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M6 3v5a3 3 0 0 0 6 0V3" />
      <path d="M9 13v2a5 5 0 0 0 10 0v-2" />
      <circle cx="19" cy="11" r="1.6" />
    </IconBase>
  );
}
