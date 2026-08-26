import type { ReactElement } from 'react';
import { IconBase, type IconProps } from './IconBase.js';

export function Settings(props: IconProps): ReactElement {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.2" />
      <path d="M12 18.8V21" />
      <path d="M21 12h-2.2" />
      <path d="M5.2 12H3" />
      <path d="M18.4 5.6l-1.6 1.6" />
      <path d="M7.2 16.8l-1.6 1.6" />
      <path d="M18.4 18.4l-1.6-1.6" />
      <path d="M7.2 7.2 5.6 5.6" />
    </IconBase>
  );
}
