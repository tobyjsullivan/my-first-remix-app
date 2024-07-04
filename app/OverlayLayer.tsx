import React, { useEffect, useRef } from 'react'
import styles from './OverlayLayer.module.scss'
import useDesignDispatch from './design/useDesignDispatch'
import Input from './design/Input'

interface Props {
  children: React.ReactNode
}

export default function OverlayLayer({ children: children }: Props) {
  const designDispatch = useDesignDispatch()

  const domRef = useRef<HTMLDivElement | null>(null)

  // Setup key listener on document
  useEffect(() => {
    if (!domRef.current) {
      return
    }

    const input = new Input(domRef.current, designDispatch)

    return input.destroy.bind(input)
  }, [designDispatch])

  return (
    <div className={styles.OverlayLayer} ref={domRef}>
      {children}
    </div>
  )
}
