import { TableditorProps } from '@components/tableditor';
import { MutableRefObject, useCallback, useState } from 'react';
import {
  CellData,
  CellChangeEventHandler,
  CellHoverEventHandler,
  CellFocusEventHandler,
  CellFocusEvent,
  CellHoverEvent,
  ResizerHoverEventHandler,
  ResizerHoverEvent,
} from '@components/tableditor/constants';
import useClickOutside from '@hooks/useClickOutside';

export interface IUseTableditorParams extends TableditorProps {}

export interface IUseTableditor {
  tableRef: MutableRefObject<HTMLTableElement | null>;
  cells: CellData[][];
  cellHoverEvent: CellHoverEvent | undefined;
  cellFocusEvent: CellFocusEvent | undefined;
  resizerHoverData: (ResizerHoverEvent & { columnCount: number }) | undefined;
  onHoverCell: CellHoverEventHandler;
  onFocusCell: CellHoverEventHandler;
  onChangeContent: CellChangeEventHandler;
  onHoverResizer: ResizerHoverEventHandler;
}

const defaultCell: CellData = {
  width: 120,
  content: '',
  backgroundColor: 'white',
  font: {
    color: 'black',
    style: 'default',
  },
};

export function useTableditor(params: IUseTableditorParams): IUseTableditor {
  const {
    cells: initialCells = [
      [{ ...defaultCell }, { ...defaultCell }],
      [{ ...defaultCell }, { ...defaultCell }],
    ],
  } = params;

  const [cells, setCells] = useState<CellData[][]>(initialCells);
  const [cellHoverEvent, setCellHoverEvent] = useState<CellHoverEvent>();
  const [cellFocusEvent, setCellFocusEvent] = useState<CellFocusEvent>();
  const [resizerHoverData, setResizerHoverData] = useState<ResizerHoverEvent & { columnCount: number }>();

  const { ref: tableRef } = useClickOutside<HTMLTableElement>({
    onClickOutside: () => onFocusCell(),
  });

  const onHoverCell: CellHoverEventHandler = useCallback((e) => {
    setCellHoverEvent(e);
  }, []);

  const onFocusCell: CellFocusEventHandler = useCallback((e) => {
    setCells((cells) => {
      if (e) {
        const { rowColumn } = e;
        const rowCount = cells.length;
        if (rowCount <= rowColumn.row || rowColumn.row < 0) {
          // Row limitation
          return cells;
        }

        const columnCount = cells[rowColumn.row].length;
        if (columnCount <= rowColumn.column) {
          // To next row
          onFocusCell({
            ...e,
            rowColumn: {
              row: rowColumn.row + 1,
              column: 0,
            },
          });
          return cells;
        }
        if (rowColumn.column < 0) {
          // To previous row
          onFocusCell({
            ...e,
            rowColumn: {
              row: rowColumn.row - 1,
              column: (cells[rowColumn.row - 1]?.length ?? 1) - 1,
            },
          });
          return cells;
        }
      }

      setCellFocusEvent(e);
      return cells;
    });
  }, []);

  const onChangeContent: CellChangeEventHandler = useCallback(({ rowColumn: { row, column }, content }) => {
    setCells((prev) => {
      // Content not changed
      if (prev[row][column].content === content) {
        return prev;
      }

      return prev.map((rows, rowIndex) => {
        return rows.map((cell, columnIndex) => {
          if (row === rowIndex && column === columnIndex) {
            return {
              ...cell,
              content,
            };
          }
          return cell;
        });
      });
    });
  }, []);

  const onHoverResizer: ResizerHoverEventHandler = useCallback((e) => {
    setCells((cells) => {
      if (e) {
        const { row } = e.rowColumn;
        setResizerHoverData({ ...e, columnCount: cells[row].length });
      } else {
        setResizerHoverData(undefined);
      }
      return cells;
    });
  }, []);

  return {
    tableRef,
    cells,
    cellHoverEvent,
    cellFocusEvent,
    resizerHoverData,
    onHoverCell,
    onFocusCell,
    onChangeContent,
    onHoverResizer,
  };
}
