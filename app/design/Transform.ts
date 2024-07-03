import { produce } from 'immer'
import DesignState, { ElementLayout, ElementType } from './DesignState'
import { appendElement } from './mutations'

export interface Step {
  apply(design: DesignState): DesignState
}

export class AppendElementStep implements Step {
  constructor(readonly elementType: ElementType, readonly layout: ElementLayout) {}

  apply(design: DesignState): DesignState {
    return appendElement(design, this.elementType, this.layout)
  }
}

export class TranslateXStep implements Step {
  constructor(readonly elementId: string, readonly delta: number) {}

  apply(design: DesignState): DesignState {
    return produce(design, (draft) => {
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

  apply(design: DesignState): DesignState {
    return produce(design, (draft) => {
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

  apply(design: DesignState): DesignState {
    return produce(design, (draft) => {
      const idx = draft.elements.findIndex(({ elementId: candidateId }) => candidateId === this.elementId)
      if (idx === -1) {
        return
      }
      const element = draft.elements[idx]
      if (element === undefined) {
        throw new Error(`Element is undefined. (${idx})`)
      }

      element.layout.width += this.delta
    })
  }
}

export class ResizeHeightStep implements Step {
  constructor(readonly elementId: string, readonly delta: number) {}

  apply(design: DesignState): DesignState {
    return produce(design, (draft) => {
      const idx = draft.elements.findIndex(({ elementId: candidateId }) => candidateId === this.elementId)
      if (idx === -1) {
        return
      }
      const element = draft.elements[idx]
      if (element === undefined) {
        throw new Error(`Element is undefined. (${idx})`)
      }

      element.layout.height += this.delta
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
