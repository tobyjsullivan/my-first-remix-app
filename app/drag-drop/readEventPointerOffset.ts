import XYCoord from '../common/XYCoord'

export default function readEventPointerOffset(e: DragEvent): XYCoord {
  const {
    /** X coordinate of the mouse pointer between the event and the padding edge of the dragged item (event target node) */
    offsetX: pointerOffsetX,
    /** Y coordinate of the mouse pointer between the event and the padding edge of the dragged item (event target node) */
    offsetY: pointerOffsetY,
  } = e

  return {
    x: pointerOffsetX,
    y: pointerOffsetY,
  }
}
