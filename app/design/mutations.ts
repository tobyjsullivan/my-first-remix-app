import { v4 as uuid } from 'uuid'

import DesignState, { ElementLayout, ElementType } from './DesignState'
import { produce } from 'immer'

export function appendElement(state: DesignState, elementType: ElementType, layout: ElementLayout): DesignState {
  const elementId = uuid()

  return produce(state, (draft) => {
    draft.elements.push({
      elementId,
      elementType,
      layout,
    })
  })
}
