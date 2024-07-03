import { Step } from './Transform'

export interface ApplyTransformAction {
  type: 'design/applyTransform'
  payload: {
    steps: Step[]
  }
}

type DesignAction = ApplyTransformAction

export default DesignAction
