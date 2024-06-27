import Frame from './Frame'
import styles from './Editor.module.scss'
import Menu from './Menu'
import OverlayLayer from './OverlayLayer'
import DesignProvider from './design/DesignProvider'

export function Editor() {
  return (
    <DesignProvider>
      <div className={styles.Editor}>
        <Frame />
        <OverlayLayer>
          <Menu />
        </OverlayLayer>
      </div>
    </DesignProvider>
  )
}
