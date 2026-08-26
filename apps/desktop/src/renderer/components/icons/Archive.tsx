import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Archive(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="4" width="17" height="4.5" rx="1.2" />
      <path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5" />
      <path d="M10 12.5h4" />
    </IconBase>
  );
}
