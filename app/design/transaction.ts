import { produce } from 'immer'
import { DesignElement } from './DesignState'

export interface ElementTransaction {
  translateX?: number
  translateY?: number
  resizeWidth?: number
  resizeHeight?: number
}

export function applyElementTransaction(element: DesignElement, transaction: ElementTransaction): DesignElement {
  const { translateX, translateY, resizeWidth, resizeHeight } = transaction

  return produce(element, (draft) => {
    if (translateX !== undefined) {
      draft.layout.left += translateX
    }
    if (translateY !== undefined) {
      draft.layout.top += translateY
    }
    if (resizeWidth !== undefined) {
      draft.layout.width += resizeWidth
    }
    if (resizeHeight !== undefined) {
      draft.layout.height += resizeHeight
    }
  })
}
