import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function GitBranch(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M6 8.2v7.6" />
      <path d="M18 11.2V13a5 5 0 0 1-5 5h-2.2" />
    </IconBase>
  );
}
