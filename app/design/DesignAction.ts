import { ElementLayout } from './DesignState'
import { ElementTransaction } from './transaction'

export interface AppendElementAction {
  type: 'design/appendElement'
  payload: {
    elementType: 'div'
    layout: ElementLayout
  }
}

export interface ApplyElementTransactionAction {
  type: 'design/applyElementTransaction'
  payload: {
    elementId: string
    transaction: ElementTransaction
  }
}

export interface CloneElementAction {
  type: 'design/cloneElement'
  payload: {
    sourceElementId: string
    transaction: ElementTransaction
  }
}

type DesignAction = AppendElementAction | ApplyElementTransactionAction | CloneElementAction

export default DesignAction
