import {
  CELL_MIN_WIDTH,
  CellContentChangeEvent,
  CellFocusEvent,
  GetEventHandledCells,
  CellResizeEvent,
  ResizerHoverEvent,
  TableditorEvent,
  CellColorChangeEvent,
} from '@components/tableditor/defines';
import { TableditorUtil } from '@components/tableditor/utils/tableditorUtil';

export namespace TableditorEventUtil {
  export const getCellFocusEventHandledCells: GetEventHandledCells<CellFocusEvent> = ({ e, cells }) => {
    if (!e) return cells;

    const {
      rowColumn: { row, column },
      direction,
    } = e;

    const rowCount = cells.length;
    if (rowCount <= row || row < 0) {
      // Row limitation
      return cells;
    }

    const columnCount = cells[row].length;
    if (columnCount <= column) {
      // To next row
      return getCellFocusEventHandledCells({
        e: {
          ...e,
          rowColumn: {
            row: row + 1,
            column: 0,
          },
        },
        cells,
      });
    }
    if (column < 0) {
      // To previous row
      return getCellFocusEventHandledCells({
        e: {
          ...e,
          rowColumn: {
            row: row - 1,
            column: (cells[row - 1]?.length ?? 1) - 1,
          },
        },
        cells,
      });
    }

    return cells.map((cellRow, rowIndex) => {
      return cellRow.map((cell, columnIndex) => {
        const focused = row === rowIndex && column === columnIndex;
        return {
          ...cell,
          focused,
          caretOffset: focused ? TableditorUtil.getCellCaretOffsetFromDirection(cell, direction) : cell.caretOffset,
          selected: false,
        };
      });
    });
  };

  export const getCellChangeEventHandledCells: GetEventHandledCells<CellContentChangeEvent> = ({ e, cells }) => {
    if (!e) return cells;

    const { rowColumn, content } = e;
    const { row, column } = rowColumn;

    // Content not changed
    if (cells[row][column].content === content) return cells;

    return TableditorUtil.getSpecificCellChangedCells(cells, rowColumn, (cell) => ({
      ...cell,
      content,
    }));
  };

  export const getResizerHoverEventHandledCells: GetEventHandledCells<ResizerHoverEvent> = ({ e, cells }) => {
    if (!e) {
      return cells.map((row) => {
        return row.map((cell) => {
          return {
            ...cell,
            resizerHovered: false,
          };
        });
      });
    }

    const { row, column } = e.rowColumn;
    const columnCount = cells[row].length;

    return cells.map((row, rowIndex) => {
      const currentColumnCount = cells[rowIndex].length;
      return row.map((cell, columnIndex) => {
        return {
          ...cell,
          resizerHovered: column === columnIndex && columnCount === currentColumnCount,
        };
      });
    });
  };

  export const getResizeEventHandledCells: GetEventHandledCells<CellResizeEvent> = ({ e, cells }) => {
    if (!e) {
      return cells.map((rows) => {
        return rows.map((cell) => {
          return {
            ...cell,
            isResizing: false,
          };
        });
      });
    }

    const {
      rowColumn: { column },
      mouseX,
      pivotX,
    } = e;

    return cells.map((rows) =>
      rows.map((originCell, columnIndex) => {
        const cell = {
          ...originCell,
          selected: false,
        };

        if (columnIndex === column + 1) {
          return {
            ...cell,
            isResizing: true,
          };
        }
        if (columnIndex === column) {
          const newWidth = mouseX! - pivotX!;
          if (isNaN(newWidth)) {
            return cell;
          }

          return {
            ...cell,
            width: Math.max(CELL_MIN_WIDTH, newWidth),
            isResizing: true,
          };
        }
        return cell;
      }),
    );
  };

  export const getCellMenuChangeBackgroundColorEventHandledCells: GetEventHandledCells<CellColorChangeEvent> = ({ e, cells }) => {
    if (!e) return cells;
    const { rowColumn, color } = e;

    return TableditorUtil.getSpecificCellChangedCells(cells, rowColumn, (cell) => ({
      ...cell,
      backgroundColor: color,
    }));
  };

  export const getCellMenuChangeFontColorEventHandledCells: GetEventHandledCells<CellColorChangeEvent> = ({ e, cells }) => {
    if (!e) return cells;
    const { rowColumn, color } = e;

    return TableditorUtil.getSpecificCellChangedCells(cells, rowColumn, (cell) => ({
      ...cell,
      font: {
        ...cell.font,
        color,
      },
    }));
  };

  export const getCellMenuClearContentEventHandledCells: GetEventHandledCells<TableditorEvent> = ({ e, cells }) => {
    if (!e) return cells;
    const { rowColumn } = e;

    return TableditorUtil.getSpecificCellChangedCells(cells, rowColumn, (cell) => {
      cell.contentEditableRef.current?.focus();
      return {
        ...cell,
        content: '',
      };
    });
  };

  export const getCellMenuAddRowAboveEventHandledCells: GetEventHandledCells<TableditorEvent> = ({ e, cells }) => {
    if (!e) return cells;
    const {
      rowColumn: { row },
    } = e;
    return TableditorUtil.getNewRowAddedCells(cells, row);
  };

  export const getCellMenuAddRowBelowEventHandledCells: GetEventHandledCells<TableditorEvent> = ({ e, cells }) => {
    if (!e) return cells;
    const {
      rowColumn: { row },
    } = e;
    return TableditorUtil.getNewRowAddedCells(cells, row + 1);
  };

  export const getCellMenuAddColumnLeftEventHandledCells: GetEventHandledCells<TableditorEvent> = ({ e, cells }) => {
    if (!e) return cells;
    const {
      rowColumn: { column },
    } = e;
    return TableditorUtil.getNewColumnAddedCells(cells, column);
  };

  export const getCellMenuAddColumnRightEventHandledCells: GetEventHandledCells<TableditorEvent> = ({ e, cells }) => {
    if (!e) return cells;
    const {
      rowColumn: { column },
    } = e;
    return TableditorUtil.getNewColumnAddedCells(cells, column + 1);
  };

  export const getCellMenuSelectRowEventHandledCells: GetEventHandledCells<TableditorEvent> = ({ e, cells }) => {
    if (!e) return cells;

    const {
      rowColumn: { row },
    } = e;

    return cells.map((cellRows, i) => {
      return cellRows.map((cell) => ({ ...cell, selected: row === i }));
    });
  };

  export const getCellMenuSelectColumnEventHandledCells: GetEventHandledCells<TableditorEvent> = ({ e, cells }) => {
    if (!e) return cells;

    const {
      rowColumn: { column },
    } = e;

    return cells.map((cellRows) => {
      return cellRows.map((cell, i) => ({ ...cell, selected: column === i }));
    });
  };
}
