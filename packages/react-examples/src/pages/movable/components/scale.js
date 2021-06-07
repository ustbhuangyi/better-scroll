import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Movable from '@better-scroll/movable'
import Zoom from '@better-scroll/zoom'

BScroll.use(Movable)
BScroll.use(Zoom)

const emojis = [
  '😀 😁 😂 🤣 😃',
  '😄 😅 😆 😉 😊',
  '😫 😴 😌 😛 😜',
  '👆🏻 😒 😓 😔 👇🏻',
]

const Scale = () => {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const BS = new BScroll(wrapperRef.current, {
      bindToTarget: true,
      scrollX: true,
      scrollY: true,
      freeScroll: true,
      movable: true,
      zoom: {
        start: 1,
        min: 0.5,
        max: 3,
      },
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

export default Scale
