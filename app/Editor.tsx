import React from 'react'

import Frame from './Frame'
import styles from './Editor.module.scss'
import Menu from './Menu'
import OverlayLayer from './OverlayLayer'
import DesignProvider from './design/DesignProvider'
import DragDropProvider from './drag-drop/DragDropProvider'
import SelectionProvider from './selection/SelectionProvider'

export function Editor() {
  return (
    <DesignProvider>
      <SelectionProvider>
        <DragDropProvider>
          <div className={styles.Editor}>
            <Frame />
            <OverlayLayer>
              <Menu />
            </OverlayLayer>
          </div>
        </DragDropProvider>
      </SelectionProvider>
    </DesignProvider>
  )
}
