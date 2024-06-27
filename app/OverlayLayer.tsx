import React from 'react'
import styles from './OverlayLayer.module.scss'

interface Props {
  children: React.ReactNode
}

export default function OverlayLayer({ children: children }: Props) {
  return <div className={styles.OverlayLayer}>{children}</div>
}
