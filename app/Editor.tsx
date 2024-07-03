import React from 'react'

import Frame from './Frame'
import styles from './Editor.module.scss'
import Menu from './Menu'
import OverlayLayer from './OverlayLayer'
import DesignProvider from './design/DesignProvider'
import DragDropProvider from './drag-drop/DragDropProvider'
import BoundingBoxes from './BoundingBoxes'

export function Editor() {
  return (
    <DesignProvider>
      <DragDropProvider>
        <div className={styles.Editor}>
          <Frame />
          <OverlayLayer>
            <BoundingBoxes />
            <Menu />
          </OverlayLayer>
        </div>
      </DragDropProvider>
    </DesignProvider>
  )
}
