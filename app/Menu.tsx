import classNames from 'classnames'
import styles from './Menu.module.scss'

import { v4 as uuid } from 'uuid'
import useDesignDispatch from './design/useDesignDispatch'

interface MenuItemProps {
  label: string
  onClick: () => void
}

function MenuItem({ label, onClick }: MenuItemProps) {
  return (
    <div className={styles.MenuItem} onClick={onClick}>
      {label}
    </div>
  )
}

export default function Menu() {
  const dispatch = useDesignDispatch()

  const handleInsertDivClicked = () => {
    dispatch({
      type: 'design/appendElement',
      payload: { elementId: uuid(), elementType: 'div', position: { top: 40, left: 40 } },
    })
  }

  return (
    <div className={classNames(styles.Menu, styles.wrapper)}>
      <div className={styles.menu}>
        <MenuItem label="Div" onClick={handleInsertDivClicked} />
      </div>
    </div>
  )
}
