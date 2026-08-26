import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Sparkle(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
    </IconBase>
  );
}
