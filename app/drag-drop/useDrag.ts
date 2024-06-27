import { useEffect, useState } from 'react'
import useDragDropDispatch from './useDragDropDispatch'
import readEventTargetOffset from './readEventTargetOffset'
import readEventPointerOffset from './readEventPointerOffset'
import useDragDropState from './useDragDropState'

type UseDragResult = [dragRef: (domRef: HTMLElement | null) => void]

interface Options {
  onDragEnd?(didDrop: boolean): void
}

export default function useDrag(elementId: string, { onDragEnd }: Options): UseDragResult {
  const dispatch = useDragDropDispatch()
  const state = useDragDropState()
  const [domNode, setDomNode] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (domNode === null) {
      return
    }

    domNode.setAttribute('draggable', 'true')
  }, [domNode])

  useEffect(() => {
    if (domNode === null) {
      return
    }

    const handleDragStarted = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'copyMove'
        e.dataTransfer.setData('application/vnd.element-id', elementId)
      }

      const initialElementOffset = readEventTargetOffset(e)
      const initialPointerOffset = readEventPointerOffset(e)

      const dropEffect = e.altKey ? 'copy' : 'move'

      dispatch({
        type: 'dragDrop/dragStart',
        payload: {
          draggingElementId: elementId,
          initialElementOffset,
          initialPointerOffset,
          dropEffect,
        },
      })
    }

    const handleDragEnded = () => {
      const didDrop = state.status === 'dropped'

      dispatch({ type: 'dragDrop/dragEnd', payload: {} })

      onDragEnd?.(didDrop)
    }

    domNode.addEventListener('dragstart', handleDragStarted)
    domNode.addEventListener('dragend', handleDragEnded)

    return () => {
      domNode.removeEventListener('dragstart', handleDragStarted)
      domNode.removeEventListener('dragend', handleDragEnded)
    }
  }, [dispatch, domNode, elementId, onDragEnd, state.status])

  return [setDomNode]
}
