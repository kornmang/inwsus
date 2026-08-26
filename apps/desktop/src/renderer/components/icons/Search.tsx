import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Search(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20 15.3 15.3" />
    </IconBase>
  );
}
