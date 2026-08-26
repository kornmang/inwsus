import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function LayoutGrid(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </IconBase>
  );
}
