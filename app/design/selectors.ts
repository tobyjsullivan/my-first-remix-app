import DesignState, { DesignElement } from './DesignState'

export function selectAllElements(state: DesignState): DesignElement[] {
  return [...state.elements]
}

export function selectElementById(state: DesignState, elementId: string): DesignElement | undefined {
  return state.elements.find(({ elementId: candidateId }) => candidateId === elementId)
}
