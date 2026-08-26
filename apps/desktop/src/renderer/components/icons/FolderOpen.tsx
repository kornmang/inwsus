import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function FolderOpen(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M3 8a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v.5H8.7a2 2 0 0 0-1.9 1.35L4 19H3V8Z" />
      <path d="M4 19l2.5-7.15A2 2 0 0 1 8.4 10.5H21l-2.4 6.85A2 2 0 0 1 16.7 19H4Z" />
    </IconBase>
  );
}
