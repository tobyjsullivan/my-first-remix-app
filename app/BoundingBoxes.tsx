import { selectSelectedElements } from './design/selectors'
import useDesignState from './design/useDesignState'
import ElementControls from './elements/ElementControls'

export default function BoundingBoxes() {
  const designState = useDesignState()

  const selectedElements = selectSelectedElements(designState)

  const controls = selectedElements.map(({ elementId }) => <ElementControls key={elementId} elementId={elementId} />)

  return <>{controls}</>
}
