import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function ExternalLink(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M14 5h5v5" />
      <path d="M19 5 10.5 13.5" />
      <path d="M8 6H5.5A1.5 1.5 0 0 0 4 7.5V18a2 2 0 0 0 2 2h10.5A1.5 1.5 0 0 0 18 18.5V16" />
    </IconBase>
  );
}
