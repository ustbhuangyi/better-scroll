import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const emojis = [
  '👉🏼 😁 😂 🤣 👈🏼',
  '😄 😅 😆 😉 😊',
  '😫 😴 😌 😛 😜',
  '👆🏻 😒 😓 😔 👇🏻',
  '😑 😶 🙄 😏 😣',
  '😞 😟 😤 😢 😭',
  '🤑 😲 ☹️ 🙁 😖',
  '👍 👎 👊 ✊ 🤛',
  '☝️ ✋ 🤚 🖐 🖖',
  '👍🏼 👎🏼 👊🏼 ✊🏼 🤛🏼',
  '☝🏽 ✋🏽 🤚🏽 🖐🏽 🖖🏽',
  '🌖 🌗 🌘 🌑 🌒',
]

const Horizontal = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollX: true,
        probeType: 3, // listening scroll event
      }))

      BS.on('scrollStart', () => {
        console.log('scrollStart-')
      })
      BS.on('scroll', ({ y }) => {
        console.log('scrolling-')
      })
      BS.on('scrollEnd', (pos) => {
        console.log(pos)
      })
    }
  }, [])

  return (
    <div className="horizontal-container view">
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

export default Horizontal
