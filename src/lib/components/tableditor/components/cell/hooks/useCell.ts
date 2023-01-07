import { CellProps } from '@components/tableditor/components/cell';
import {
  DragEventHandler,
  FocusEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
  MouseEventHandler,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ContentEditableUtil } from '@utils/contentEditableUtil';

export interface IUseCellParams extends CellProps {}

export interface IUseCell {
  resizerRef: MutableRefObject<HTMLDivElement | null>;
  contentInnerText: string;
  handleTableDataHover: MouseEventHandler<HTMLTableDataCellElement>;
  handleTableDataClick: MouseEventHandler<HTMLTableDataCellElement>;
  handleContentEditableFocus: FocusEventHandler<HTMLDivElement>;
  handleContentEditableKeyDown: KeyboardEventHandler<HTMLDivElement>;
  handleContentEditableInput: FormEventHandler<HTMLDivElement>;
  handleResizerMouseEnter: MouseEventHandler<HTMLDivElement>;
  handleResizerMouseLeave: MouseEventHandler<HTMLDivElement>;
  handleResizerMouseDown: MouseEventHandler<HTMLDivElement>;
  handleResizerMouseUp: MouseEventHandler<HTMLDivElement>;
  handleResizerPreventDrag: DragEventHandler<HTMLDivElement>;
  handleResizerDragEnd: DragEventHandler<HTMLDivElement>;
}

export function useCell(params: IUseCellParams): IUseCell {
  const {
    cell: { focused, isResizing, contentEditableRef, caretOffset },
    row,
    column,
    onCellHover,
    onCellFocus,
    onContentChange,
    onResizerHover,
    onResizeStart,
    onResizeEnd,
    onCellKeyDown,
  } = params;

  const resizerRef = useRef<HTMLDivElement>(null);

  const [contentInnerText, setContentInnerText] = useState<string>('');

  useEffect(() => {
    if (!focused) {
      onContentChange({ rowColumn: { row, column }, content: contentEditableRef.current?.innerText ?? '' });
      return;
    }

    // Move cursor position
    const cellElement = contentEditableRef.current;
    ContentEditableUtil.setCaretOffset((cellElement?.firstChild as HTMLElement) ?? cellElement, caretOffset);
  }, [focused, onContentChange, row, column]);

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
      onCellKeyDown();

      switch (e.key) {
        case 'Enter':
          if (e.shiftKey) {
            return;
          }

          e.preventDefault();
          onCellFocus({ rowColumn: { row: row + 1, column }, direction: 'down' });
          return;

        case 'ArrowRight':
          if (e.shiftKey) return;

          if (ContentEditableUtil.getIsMovableToRight(contentEditableRef.current!)) {
            e.preventDefault();
            onCellFocus({ rowColumn: { row, column: column + 1 }, direction: 'right' });
          }
          return;

        case 'ArrowLeft':
          if (e.shiftKey) return;

          if (ContentEditableUtil.getIsMovableToLeft(contentEditableRef.current!)) {
            e.preventDefault();
            onCellFocus({ rowColumn: { row, column: column - 1 }, direction: 'left' });
          }
          return;

        case 'ArrowUp':
          if (e.shiftKey) return;

          if (ContentEditableUtil.getIsMovableToUp(contentEditableRef.current!)) {
            e.preventDefault();
            onCellFocus({ rowColumn: { row: row - 1, column }, direction: 'up' });
          }
          return;

        case 'ArrowDown':
          if (e.shiftKey) return;

          if (ContentEditableUtil.getIsMovableToDown(contentEditableRef.current!)) {
            e.preventDefault();
            onCellFocus({ rowColumn: { row: row + 1, column }, direction: 'down' });
          }
          return;
      }
    },
    [onCellKeyDown, row, column, onCellFocus],
  );

  const handleContentEditableInput: FormEventHandler<HTMLDivElement> = useCallback((e) => {
    setContentInnerText((e.target as HTMLDivElement).innerText);
  }, []);

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
    resizerRef,
    contentInnerText,
    handleTableDataHover,
    handleTableDataClick,
    handleContentEditableFocus,
    handleContentEditableKeyDown,
    handleContentEditableInput,
    handleResizerMouseEnter,
    handleResizerMouseLeave,
    handleResizerMouseDown,
    handleResizerMouseUp,
    handleResizerPreventDrag,
    handleResizerDragEnd,
  };
}
