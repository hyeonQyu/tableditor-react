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
  handleTableDataHover: MouseEventHandler<HTMLTableDataCellElement>;
  handleTableDataClick: MouseEventHandler<HTMLTableDataCellElement>;
  handleContentEditableFocus: FocusEventHandler<HTMLDivElement>;
  handleContentEditableKeyDown: KeyboardEventHandler<HTMLDivElement>;
  handleResizerMouseEnter: MouseEventHandler<HTMLDivElement>;
  handleResizerMouseLeave: MouseEventHandler<HTMLDivElement>;
  handleResizerMouseDown: MouseEventHandler<HTMLDivElement>;
  handleResizerMouseUp: MouseEventHandler<HTMLDivElement>;
  handleResizerPreventDrag: DragEventHandler<HTMLDivElement>;
  handleResizerDragEnd: DragEventHandler<HTMLDivElement>;
}

export function useCell(params: IUseCellParams): IUseCell {
  const { row, column, focusEvent, isResizing, onCellHover, onCellFocus, onContentChange, onResizerHover, onResizeStart, onResizeEnd } = params;
  const focused = focusEvent?.rowColumn.row === row && focusEvent?.rowColumn.column === column;

  const contentEditableRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focused) {
      onContentChange({ rowColumn: { row, column }, content: contentEditableRef.current?.innerText ?? '' });
      return;
    }

    // Move cursor position
    const selectionNode = (contentEditableRef?.current?.firstChild ?? contentEditableRef?.current) as Node;
    const { caretPosition } = focusEvent;
    ContentEditableUtil.moveCaret(selectionNode, caretPosition);
  }, [focused, focusEvent, onContentChange, row, column]);

  const handleTableDataHover: MouseEventHandler<HTMLTableDataCellElement> = useCallback(() => {
    onCellHover({ rowColumn: { row, column } });
  }, [row, column, onCellHover]);

  const handleTableDataClick: MouseEventHandler<HTMLTableDataCellElement> = useCallback(() => {
    if (!isResizing) {
      contentEditableRef.current?.focus();
    }
  }, [isResizing]);

  const handleContentEditableFocus: FocusEventHandler<HTMLDivElement> = useCallback(() => {
    onCellFocus({ rowColumn: { row, column } });
  }, [row, column, onCellFocus]);

  const handleContentEditableKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();

          if (e.shiftKey) {
            return;
          }

          onCellFocus({ rowColumn: { row: row + 1, column }, caretPosition: 'tail' });
          return;

        case 'ArrowRight':
          if (ContentEditableUtil.getIsMovableToRight()) {
            e.preventDefault();
            onCellFocus({ rowColumn: { row, column: column + 1 }, caretPosition: 'head' });
          }
          return;

        case 'ArrowLeft':
          if (ContentEditableUtil.getIsMovableToLeft()) {
            e.preventDefault();
            onCellFocus({ rowColumn: { row, column: column - 1 }, caretPosition: 'tail' });
          }
          return;

        case 'ArrowUp':
          e.preventDefault();
          onCellFocus({ rowColumn: { row: row - 1, column }, caretPosition: 'tail' });
          return;

        case 'ArrowDown':
          e.preventDefault();
          onCellFocus({ rowColumn: { row: row + 1, column }, caretPosition: 'tail' });
          return;
      }
    },
    [row, column, onCellFocus],
  );

  const handleResizerMouseEnter: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onResizerHover({ rowColumn: { row, column } });
  }, [row, column, onResizerHover]);

  const handleResizerMouseLeave: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onResizerHover();
  }, [onResizerHover]);

  const handleResizerMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onResizeStart({ rowColumn: { row, column }, pivotX: contentEditableRef.current?.getBoundingClientRect().x });
  }, [onResizeStart, row, column]);

  const handleResizerMouseUp: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    onResizeEnd();
  }, [onResizeEnd]);

  const handleResizerPreventDrag: DragEventHandler<HTMLDivElement> = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleResizerDragEnd: DragEventHandler<HTMLDivElement> = useCallback(() => {
    onResizeEnd();
  }, [onResizeEnd]);

  return {
    contentEditableRef,
    resizerRef,
    focused,
    handleTableDataHover,
    handleTableDataClick,
    handleContentEditableFocus,
    handleContentEditableKeyDown,
    handleResizerMouseEnter,
    handleResizerMouseLeave,
    handleResizerMouseDown,
    handleResizerMouseUp,
    handleResizerPreventDrag,
    handleResizerDragEnd,
  };
}
