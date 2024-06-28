import { produce } from 'immer'
import { v4 as uuid } from 'uuid'
import DesignAction, { AppendElementAction, ApplyElementTransactionAction, CloneElementAction } from './DesignAction'
import DesignState from './DesignState'
import { applyElementTransaction } from './transaction'

function applyAppendElement(state: DesignState, { payload }: AppendElementAction): DesignState {
  const { elementType, layout } = payload

  const elementId = uuid()

  return produce(state, (draft) => {
    draft.elements.push({
      elementId,
      elementType,
      layout,
    })
  })
}

function applyElementTransactionAction(state: DesignState, { payload }: ApplyElementTransactionAction): DesignState {
  const { elementId, transaction } = payload

  return produce(state, (draft) => {
    const idx = draft.elements.findIndex(({ elementId: candidateId }) => candidateId === elementId)
    if (idx === -1) {
      return
    }
    const element = draft.elements[idx]
    if (element === undefined) {
      throw new Error(`Element is undefined. (${idx})`)
    }

    draft.elements[idx] = applyElementTransaction(element, transaction)
  })
}

function applyCloneElement(state: DesignState, { payload }: CloneElementAction): DesignState {
  const { sourceElementId, transaction } = payload

  const elementId = uuid()

  const sourceElement = state.elements.find(({ elementId: candidateId }) => candidateId === sourceElementId)
  if (sourceElement === undefined) {
    throw new Error(`Cannot find clone source element. (${sourceElementId})`)
  }

  const element = applyElementTransaction(
    {
      ...sourceElement,
      elementId,
    },
    transaction
  )

  return produce(state, (draft) => {
    draft.elements.push(element)
  })
}

export default function designReducer(state: DesignState, action: DesignAction): DesignState {
  const { type: actionType } = action
  switch (actionType) {
    case 'design/appendElement':
      return applyAppendElement(state, action)
    case 'design/applyElementTransaction':
      return applyElementTransactionAction(state, action)
    case 'design/cloneElement':
      return applyCloneElement(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
