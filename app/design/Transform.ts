import { produce } from 'immer'
import { v4 as uuid } from 'uuid'
import DesignState, { ElementLayout, ElementType } from './DesignState'
import { GripPosition } from './DesignAction'
import XYCoord from '../common/XYCoord'

const MIN_ELEMENT_WIDTH = 15
const MIN_ELEMENT_HEIGHT = 15

export interface Step {
  apply(state: DesignState): DesignState
}

export class AppendElementStep implements Step {
  constructor(readonly elementType: ElementType, readonly layout: ElementLayout) {}

  apply(state: DesignState): DesignState {
    const elementId = uuid()

    return produce(state, (draft) => {
      draft.elements.push({
        elementId,
        elementType: this.elementType,
        layout: this.layout,
      })
    })
  }
}

export class TranslateXStep implements Step {
  constructor(readonly elementId: string, readonly delta: number) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      const idx = draft.elements.findIndex(({ elementId: candidateId }) => candidateId === this.elementId)
      if (idx === -1) {
        return
      }
      const element = draft.elements[idx]
      if (element === undefined) {
        throw new Error(`Element is undefined. (${idx})`)
      }

      element.layout.left += this.delta
    })
  }
}

export class TranslateYStep implements Step {
  constructor(readonly elementId: string, readonly delta: number) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      const idx = draft.elements.findIndex(({ elementId: candidateId }) => candidateId === this.elementId)
      if (idx === -1) {
        return
      }
      const element = draft.elements[idx]
      if (element === undefined) {
        throw new Error(`Element is undefined. (${idx})`)
      }

      element.layout.top += this.delta
    })
  }
}

export class ResizeWidthStep implements Step {
  constructor(readonly elementId: string, readonly delta: number) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      const idx = draft.elements.findIndex(({ elementId: candidateId }) => candidateId === this.elementId)
      if (idx === -1) {
        return
      }
      const element = draft.elements[idx]
      if (element === undefined) {
        throw new Error(`Element is undefined. (${idx})`)
      }

      element.layout.width += this.delta

      if (element.layout.width < MIN_ELEMENT_WIDTH) {
        element.layout.width = MIN_ELEMENT_WIDTH
      }
    })
  }
}

export class ResizeHeightStep implements Step {
  constructor(readonly elementId: string, readonly delta: number) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      const idx = draft.elements.findIndex(({ elementId: candidateId }) => candidateId === this.elementId)
      if (idx === -1) {
        return
      }
      const element = draft.elements[idx]
      if (element === undefined) {
        throw new Error(`Element is undefined. (${idx})`)
      }

      element.layout.height += this.delta

      if (element.layout.height < MIN_ELEMENT_HEIGHT) {
        element.layout.height = MIN_ELEMENT_HEIGHT
      }
    })
  }
}

export class SelectElementStep implements Step {
  constructor(readonly elementId: string) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      draft.selection.ranges = [{ elementId: this.elementId }]
    })
  }
}

export class ClearSelectionStep implements Step {
  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      draft.selection.ranges = []
    })
  }
}

export class PrepareElementDrag implements Step {
  constructor(readonly elementId: string, readonly initialPointerOffset: XYCoord) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'pending-element-drag',
        elementId: this.elementId,
        initialPointerOffset: this.initialPointerOffset,
      }
    })
  }
}

export class PrepareGripDrag implements Step {
  constructor(
    readonly elementId: string,
    readonly gripPosition: GripPosition,
    readonly initialPointerOffset: XYCoord
  ) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'pending-grip-drag',
        elementId: this.elementId,
        gripPosition: this.gripPosition,
        initialPointerOffset: this.initialPointerOffset,
      }
    })
  }
}

export class StartDraggingElement implements Step {
  constructor(readonly currentPointerOffset: XYCoord) {}
  apply(state: DesignState): DesignState {
    if (state.draggingState.status !== 'pending-element-drag') {
      throw new Error(`Unexpected dragging status: ${state.draggingState.status}`)
    }

    const { elementId, initialPointerOffset } = state.draggingState

    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'dragging-element',
        elementId,
        dropEffect: 'move',
        initialPointerOffset,
        currentPointerOffset: this.currentPointerOffset,
      }
    })
  }
}

export class StartDraggingGrip implements Step {
  constructor(readonly currentPointerOffset: XYCoord) {}

  apply(state: DesignState): DesignState {
    if (state.draggingState.status !== 'pending-grip-drag') {
      throw new Error(`Unexpected dragging status: ${state.draggingState.status}`)
    }

    const { elementId, gripPosition, initialPointerOffset } = state.draggingState
    return produce(state, (draft) => {
      draft.draggingState = {
        status: 'dragging-grip',
        elementId,
        gripPosition,
        initialPointerOffset,
        currentPointerOffset: this.currentPointerOffset,
      }
    })
  }
}

export class UpdateDragPositionStep implements Step {
  constructor(readonly currentPointerOffset: XYCoord) {}

  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      const { status } = draft.draggingState
      if (status === 'dragging-element' || status === 'dragging-grip') {
        draft.draggingState.currentPointerOffset = this.currentPointerOffset
      }
    })
  }
}

export class EndDragStep implements Step {
  apply(state: DesignState): DesignState {
    return produce(state, (draft) => {
      draft.draggingState = { status: 'inactive' }
    })
  }
}

export default class Transform {
  private readonly steps: Step[] = []

  constructor(private readonly initDesign: DesignState) {}

  get result(): DesignState {
    return this.steps.reduce((result, step) => step.apply(result), this.initDesign)
  }

  step(step: Step): this {
    this.steps.push(step)

    return this
  }

  getSteps(): Step[] {
    return [...this.steps]
  }
}
