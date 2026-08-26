import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Play(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M7 4.5v15l13-7.5-13-7.5Z" />
    </IconBase>
  );
}
