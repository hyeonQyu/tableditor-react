import { EventHandler, MouseEventHandler } from 'react';

export interface MenuRef {
  open: MouseEventHandler;
  close: EventHandler<any>;
  toggle: MouseEventHandler;
  element: HTMLDivElement | null;
}

export interface MenuPosition {
  top: number;
  left: number;
}
