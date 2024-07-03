import DesignAction, { ApplyTransformAction } from './DesignAction'
import DesignState from './DesignState'
import Transform from './Transform'

function applyTransformAction(state: DesignState, { payload }: ApplyTransformAction): DesignState {
  const { steps } = payload

  const transform = new Transform(state)
  steps.forEach((step) => transform.step(step))
  return transform.result
}

export default function designReducer(state: DesignState, action: DesignAction): DesignState {
  const { type: actionType } = action
  switch (actionType) {
    case 'design/applyTransform':
      return applyTransformAction(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
