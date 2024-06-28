import classNames from 'classnames'
import styles from './Menu.module.scss'

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
    const x = Math.round(Math.random() * 400)
    const y = Math.round(Math.random() * 400)

    dispatch({
      type: 'design/appendElement',
      payload: { elementType: 'div', position: { x, y } },
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
