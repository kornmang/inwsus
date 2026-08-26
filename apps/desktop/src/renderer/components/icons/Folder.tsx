import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Folder(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h4.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </IconBase>
  );
}
