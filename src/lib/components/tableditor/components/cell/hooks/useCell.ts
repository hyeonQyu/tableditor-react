import { CellProps } from '@components/tableditor/components/cell';
import {
  DragEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { ContentEditableUtil } from '@utils/contentEditableUtil';

export interface IUseCellParams extends CellProps {}

export interface IUseCell {
  contentEditableRef: MutableRefObject<HTMLDivElement | null>;
  resizerRef: MutableRefObject<HTMLDivElement | null>;
  focused: boolean;
  handleHoverTableData: MouseEventHandler<HTMLTableDataCellElement>;
  handleClickTableData: MouseEventHandler<HTMLTableDataCellElement>;
  handleFocusContentEditable: FocusEventHandler<HTMLDivElement>;
  handleKeyDownContentEditable: KeyboardEventHandler<HTMLDivElement>;
  handleEnterResizer: MouseEventHandler<HTMLDivElement>;
  handleLeaveResizer: MouseEventHandler<HTMLDivElement>;
  handleMouseDownResizer: MouseEventHandler<HTMLDivElement>;
  handleMouseUpResizer: MouseEventHandler<HTMLDivElement>;
  handlePreventDragResizer: DragEventHandler<HTMLDivElement>;
  handleDragEndResizer: DragEventHandler<HTMLDivElement>;
}

export function useCell(params: IUseCellParams): IUseCell {
  const { row, column, focusEvent, isResizing, onHoverCell, onFocusCell, onChangeContent, onHoverResizer, onResizeStart, onResizeEnd } = params;
  const focused = focusEvent?.rowColumn.row === row && focusEvent?.rowColumn.column === column;

  const contentEditableRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focused) {
      onChangeContent({ rowColumn: { row, column }, content: contentEditableRef.current?.innerText ?? '' });
      return;
    }

    // Move cursor position
    const selectionNode = (contentEditableRef?.current?.firstChild ?? contentEditableRef?.current) as Node;
    const { directionTo } = focusEvent;
    ContentEditableUtil.moveCaret(selectionNode, directionTo);
  }, [focused, focusEvent, onChangeContent, row, column]);

  const handleHoverTableData: MouseEventHandler<HTMLTableDataCellElement> = useCallback(() => {
    onHoverCell({ rowColumn: { row, column } });
  }, [row, column, onHoverCell]);

  const handleClickTableData: MouseEventHandler<HTMLTableDataCellElement> = useCallback(() => {
    if (!isResizing) {
      contentEditableRef.current?.focus();
    }
  }, [isResizing]);

  const handleFocusContentEditable: FocusEventHandler<HTMLDivElement> = useCallback(() => {
    onFocusCell({ rowColumn: { row, column } });
  }, [row, column, onFocusCell]);

  const handleKeyDownContentEditable: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      switch (e.key) {
        case 'Enter':
          if (e.shiftKey) {
            return;
          }
          e.preventDefault();
          onFocusCell({ rowColumn: { row: row + 1, column }, directionTo: 'down' });
          return;

        case 'ArrowRight':
          if (ContentEditableUtil.getIsMovableToRight()) {
            e.preventDefault();
            onFocusCell({ rowColumn: { row, column: column + 1 }, directionTo: 'right' });
          }
          return;

        case 'ArrowLeft':
          if (ContentEditableUtil.getIsMovableToLeft()) {
            e.preventDefault();
            onFocusCell({ rowColumn: { row, column: column - 1 }, directionTo: 'left' });
          }
          return;

        case 'ArrowUp':
          e.preventDefault();
          onFocusCell({ rowColumn: { row: row - 1, column }, directionTo: 'up' });
          return;

        case 'ArrowDown':
          e.preventDefault();
          onFocusCell({ rowColumn: { row: row + 1, column }, directionTo: 'down' });
          return;
      }
    },
    [row, column, onFocusCell],
  );

  const handleEnterResizer: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onHoverResizer({ rowColumn: { row, column } });
  }, [row, column, onHoverResizer]);

  const handleLeaveResizer: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onHoverResizer();
  }, [onHoverResizer]);

  const handleMouseDownResizer: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onResizeStart({ column, pivotX: contentEditableRef.current?.getBoundingClientRect().x });
  }, [onResizeStart, column]);

  const handleMouseUpResizer: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onResizeEnd();
  }, [onResizeEnd]);

  const handlePreventDragResizer: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDragEndResizer: DragEventHandler<HTMLDivElement> = useCallback(() => {
    onResizeEnd();
  }, [onResizeEnd]);

  return {
    contentEditableRef,
    resizerRef,
    focused,
    handleHoverTableData,
    handleClickTableData,
    handleFocusContentEditable,
    handleKeyDownContentEditable,
    handleEnterResizer,
    handleLeaveResizer,
    handleMouseDownResizer,
    handleMouseUpResizer,
    handlePreventDragResizer,
    handleDragEndResizer,
  };
}
