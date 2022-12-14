import { RefObject } from 'react';
import { RectSize } from '@defines/types';

export interface CellData {
  content: string;
  width: number;
  backgroundColor: TableditorColor;
  font: Font;
}

export interface RenderingCellData extends CellData {
  focused: boolean;
  resizerHovered: boolean;
  isResizing: boolean;
  contentEditableRef: RefObject<HTMLDivElement>;
  caretOffset: number;
}

export interface Font {
  color: TableditorColor;
  style: FontStyle;
}

export type TableditorAchromaticColor = 'black' | 'white';
export type TableditorChromaticColor = 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';

export type TableditorChromaticDarkColor = `${TableditorChromaticColor}_dark`;
export type TableditorChromaticLightColor = `${TableditorChromaticColor}_light`;

export type TableditorColor = TableditorAchromaticColor | TableditorChromaticDarkColor | TableditorChromaticLightColor;
export type TableditorColorName = TableditorAchromaticColor | TableditorChromaticColor;

export type ColorMap = Record<TableditorColor, string>;

export type BackgroundColorMap = Record<TableditorColorName, Extract<TableditorColor, TableditorAchromaticColor | TableditorChromaticLightColor>>;

export type FontColorMap = Record<TableditorColorName, Extract<TableditorColor, TableditorAchromaticColor | TableditorChromaticDarkColor>>;

export type FontStyle = 'default' | 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface RowColumn {
  row: number;
  column: number;
}

export type GetEventHandledCells<E = unknown> = (param: { e?: E; cells: RenderingCellData[][] }) => RenderingCellData[][];

export interface TableExtender {
  size: RectSize;
  visible: boolean;
}
