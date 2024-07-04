import XYCoord from '../common/XYCoord'

export default function readEventPointerOffset(e: MouseEvent): XYCoord {
  const { clientX: pointerOffsetX, clientY: pointerOffsetY } = e

  return {
    x: pointerOffsetX,
    y: pointerOffsetY,
  }
}
