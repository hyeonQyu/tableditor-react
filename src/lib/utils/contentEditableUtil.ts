import { Direction } from '@constants/types';

export namespace ContentEditableUtil {
  /**
   * Check the caret is positioned at the far right of the cell
   */
  export function getIsMovableToRight() {
    const selection = window.getSelection();
    const length = selection?.focusNode?.textContent?.length ?? 0;
    const offset = selection?.focusOffset;
    return length === offset;
  }

  /**
   * Check the caret is positioned at the far left of the cell
   */
  export function getIsMovableToLeft() {
    const selection = window.getSelection();
    const offset = selection?.focusOffset;
    return offset === 0;
  }

  /**
   * Move the position of caret by direction
   * @param node
   * @param direction
   */
  export function moveCaret(node: Node, direction?: Direction) {
    switch (direction) {
      case 'right':
        moveCaretToFirst(node);
        break;

      case 'left':
      case 'up':
      case 'down':
        moveCaretToLast(node);
        break;
    }
  }

  /**
   * Move the caret to first offset of the node
   * @param node
   */
  function moveCaretToFirst(node: Node) {
    const selection = window.getSelection();
    selection?.setBaseAndExtent(node, 0, node, 0);
  }

  /**
   * Move the caret to last offset of the node
   * @param node
   */
  function moveCaretToLast(node: Node) {
    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.selectNodeContents(node);
    newRange.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(newRange);
    selection?.collapseToEnd();
  }
}
