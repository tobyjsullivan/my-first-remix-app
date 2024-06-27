import { produce } from 'immer'
import DragDropAction, { DragOverAction, DragStartAction, DropAction } from './DragDropAction'
import DragDropState from './DragDropState'

const INACTIVE_STATE: DragDropState = { status: 'inactive' }

function applyDragStart(state: DragDropState, { payload }: DragStartAction): DragDropState {
  const { draggingElementId, initialElementOffset, initialPointerOffset, dropEffect } = payload

  return {
    status: 'dragging',
    draggingElementId,
    initialElementOffset,
    initialPointerOffset,
    dropEffect,
    targetPointerOffset: undefined,
  }
}

function applyDragOver(state: DragDropState, { payload }: DragOverAction): DragDropState {
  const { dropEffect, targetPointerOffset } = payload

  if (state.status !== 'dragging') {
    // No-op
    return state
  }

  return produce(state, (draft) => {
    draft.dropEffect = dropEffect
    draft.targetPointerOffset = targetPointerOffset
  })
}

function applyDragEnd(state: DragDropState): DragDropState {
  const { status } = state
  if (status === 'inactive') {
    // No-op
    return state
  }

  return INACTIVE_STATE
}

function applyDrop(state: DragDropState, { payload }: DropAction): DragDropState {
  const { dropPointerOffset } = payload
  const { status } = state
  if (status === 'inactive') {
    // No-op
    return state
  }

  if (status !== 'dragging') {
    // Unexpected dragging state.
    console.warn(`Unexpected dragging state on drop:`, status)
    // Reset to inactive.
    return INACTIVE_STATE
  }

  const { draggingElementId, initialElementOffset, initialPointerOffset } = state

  return {
    status: 'dropped',
    draggingElementId,
    initialElementOffset,
    initialPointerOffset,
    dropPointerOffset,
  }
}
export default function dragDropReducer(state: DragDropState, action: DragDropAction): DragDropState {
  console.log(`[dragDropReducer] action type:`, action.type)

  const { type: actionType } = action
  switch (actionType) {
    case 'dragDrop/dragStart':
      return applyDragStart(state, action)
    case 'dragDrop/dragOver':
      return applyDragOver(state, action)
    case 'dragDrop/dragEnd':
      return applyDragEnd(state)
    case 'dragDrop/drop':
      return applyDrop(state, action)
    default:
      throw new Error(`Unknown action type: ${actionType}`)
  }
}
