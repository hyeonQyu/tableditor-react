export interface CellData {
  content: string;
  width: number;
  backgroundColor: TableditorColor;
  font: Font;
}

export interface Font {
  color: TableditorColor;
  style: FontStyle;
}

export type TableditorColor =
  | 'black'
  | 'white'
  | 'gray_dark'
  | 'gray_light'
  | 'brown_dark'
  | 'brown_light'
  | 'orange_dark'
  | 'orange_light'
  | 'yellow_dark'
  | 'yellow_light'
  | 'green_dark'
  | 'green_light'
  | 'blue_dark'
  | 'blue_light'
  | 'purple_dark'
  | 'purple_light'
  | 'pink_dark'
  | 'pink_light'
  | 'red_dark'
  | 'red_light';

export type FontStyle = 'default' | 'bold' | 'italic' | 'underline' | 'strikethrough';

export type ColorMap = {
  [key in TableditorColor]: string;
};

export const COLOR_MAP: ColorMap = {
  black: '#1d1d1d',
  white: '#ffffff',
  gray_dark: '#5c5c5c',
  gray_light: '#b1b1b1',
  brown_dark: '#613622',
  brown_light: '#c2aa9d',
  orange_dark: '#d05406',
  orange_light: '#f5bdac',
  yellow_dark: '#deaf03',
  yellow_light: '#f5db8d',
  green_dark: '#0b8403',
  green_light: '#c6ffc4',
  blue_dark: '#0255b4',
  blue_light: '#b3deff',
  purple_dark: '#4401d7',
  purple_light: '#c3b3ff',
  pink_dark: '#cd08e2',
  pink_light: '#edb8ff',
  red_dark: '#cb0000',
  red_light: '#ffc4c4',
};

export interface RowColumn {
  row: number;
  column: number;
}

export type HoverCellEventHandler = (param: RowColumn) => void;

export type ChangeContentEventHandler = (param: RowColumn & { content: string }) => void;
