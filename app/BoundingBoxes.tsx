import ElementControls from './elements/ElementControls'
import { selectSelectedElements } from './selection/selectors'
import useSelectionState from './selection/useSelectionState'

export default function BoundingBoxes() {
  const selectionState = useSelectionState()

  const selectedElements = selectSelectedElements(selectionState)

  const controls = selectedElements.map(({ elementId }) => <ElementControls key={elementId} elementId={elementId} />)

  return <>{controls}</>
}
