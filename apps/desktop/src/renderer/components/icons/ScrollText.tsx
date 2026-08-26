import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function ScrollText(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M6 4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h9" />
      <path d="M6 4h10a2 2 0 0 1 2 2v13a1.5 1.5 0 0 1-3 0V6H8" />
      <path d="M8 8h6" />
      <path d="M8 12h6" />
    </IconBase>
  );
}
