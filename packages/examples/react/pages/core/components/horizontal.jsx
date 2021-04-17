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
  const scrollRef = useRef(null)
  const bs = useRef(null)

  useEffect(() => {
    if (!bs.current) {
      const BS = (bs.current = new BScroll(scrollRef.current, {
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
  }, [scrollRef.current])

  return (
    <div className="horizontal-container view">
      <div className="scroll-wrapper" ref={scrollRef}>
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
