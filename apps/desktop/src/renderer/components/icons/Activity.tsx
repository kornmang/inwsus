import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Activity(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </IconBase>
  );
}
