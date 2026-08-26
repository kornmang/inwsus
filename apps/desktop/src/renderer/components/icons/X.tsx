import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function X(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M5 5l14 14" />
      <path d="M19 5 5 19" />
    </IconBase>
  );
}
