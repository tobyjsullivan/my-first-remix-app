import XYCoord from '../common/XYCoord'
import { DesignDispatch } from './useDesignDispatch'

function readPointerPosition(e: MouseEvent): XYCoord {
  const { clientX, clientY } = e

  return { x: clientX, y: clientY }
}

export default class Input {
  private readonly removeListeners: () => void

  constructor(readonly dom: HTMLElement, readonly dispatch: DesignDispatch) {
    this.removeListeners = Input.initHandlers(this, dom)
  }

  handleMouseDown(e: MouseEvent) {
    this.dispatch({
      type: 'design/mouseDown',
      payload: {
        event: {
          target: { targetType: 'frame' },
          pointerOffset: readPointerPosition(e),
        },
      },
    })
  }

  handleMouseMove(e: MouseEvent) {
    this.dispatch({
      type: 'design/mouseMove',
      payload: {
        event: {
          target: { targetType: 'frame' },
          pointerOffset: readPointerPosition(e),
        },
      },
    })
  }

  handleMouseUp(e: MouseEvent) {
    this.dispatch({
      type: 'design/mouseUp',
      payload: {
        event: {
          target: { targetType: 'frame' },
          pointerOffset: readPointerPosition(e),
        },
      },
    })
  }

  handleKeyDown(e: KeyboardEvent) {
    const { key, shiftKey, metaKey: nativeMetaKey, ctrlKey: nativeCtrlKey } = e

    const metaKey = nativeMetaKey || nativeCtrlKey
    this.dispatch({ type: 'design/keyDown', payload: { key, shiftKey, metaKey } })
  }

  destroy() {
    this.removeListeners()
  }

  private static initHandlers(input: Input, dom: HTMLElement): () => void {
    const handleMouseDown = input.handleMouseDown.bind(input)
    const handleMouseMove = input.handleMouseMove.bind(input)
    const handleMouseUp = input.handleMouseUp.bind(input)
    const handleKeyDown = input.handleKeyDown.bind(input)

    dom.addEventListener('mousedown', handleMouseDown)
    dom.addEventListener('mousemove', handleMouseMove)
    dom.addEventListener('mouseup', handleMouseUp)
    dom.ownerDocument.addEventListener('keydown', handleKeyDown)

    return () => {
      dom.removeEventListener('mousedown', handleMouseDown)
      dom.removeEventListener('mousemove', handleMouseMove)
      dom.removeEventListener('mouseup', handleMouseUp)
      dom.ownerDocument.removeEventListener('keydown', handleKeyDown)
    }
  }
}
