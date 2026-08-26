import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Zap(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M13 3 5 13.5h5.5L11 21l8-11h-5.5L13 3Z" />
    </IconBase>
  );
}
