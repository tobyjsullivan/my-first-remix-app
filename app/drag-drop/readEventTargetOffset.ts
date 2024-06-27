import XYCoord from '../design/XYCoord'

export default function readEventTargetOffset(e: DragEvent): XYCoord {
  const {
    /** horizontal coordinate within the application's viewport at which the event occurred (as opposed to the coordinate within the page). */
    clientX: sourceOffsetX,
    /** vertical coordinate within the application's viewport at which the event occurred (as opposed to the coordinate within the page). */
    clientY: sourceOffsetY,
  } = e
  const {
    /** X coordinate of the mouse pointer between the event and the padding edge of the dragged item (event target node) */
    offsetX: pointerOffsetX,
    /** Y coordinate of the mouse pointer between the event and the padding edge of the dragged item (event target node) */
    offsetY: pointerOffsetY,
  } = e

  return {
    x: sourceOffsetX - pointerOffsetX,
    y: sourceOffsetY - pointerOffsetY,
  }
}
