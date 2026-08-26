import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Hexagon(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M12 3 20 8v8l-8 5-8-5V8Z" />
    </IconBase>
  );
}
