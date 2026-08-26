import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Home(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h4v-5h2v5h4a1 1 0 0 0 1-1v-9" />
    </IconBase>
  );
}
