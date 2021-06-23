import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Movable from '@better-scroll/movable'

BScroll.use(Movable)

const emojis = [
  '😀 😁 😂 🤣 😃',
  '😄 😅 😆 😉 😊',
  '😫 😴 😌 😛 😜',
  '👆🏻 😒 😓 😔 👇🏻',
]

const Default = () => {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const BS = new BScroll(wrapperRef.current, {
      bindToTarget: true,
      scrollX: true,
      scrollY: true,
      freeScroll: true,
      movable: true,
      startX: 20,
      startY: 20,
    })

    return () => {
      BS.destroy()
    }
  }, [])

  return (
    <div className="movable-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="scroll-content">
          {emojis.map((item, index) => (
            <div key={index} className="scroll-item">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Default
