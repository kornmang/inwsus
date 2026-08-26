import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Wrench(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L4 17l3 3 5.6-5.3a4 4 0 0 0 5.1-5.4l-2.8 2.8-2.1-2.1 2.9-2.7Z" />
    </IconBase>
  );
}
