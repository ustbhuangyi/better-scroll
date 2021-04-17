import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'

const emojis = [
  '😀 😁 😂 🤣 😃',
  '😄 😅 😆 😉 😊',
  '😫 😴 😌 😛 😜',
  '👆🏻 😒 😓 😔 👇🏻',
  '😑 😶 🙄 😏 😣',
  '😞 😟 😤 😢 😭',
  '🤑 😲 🙄 🙁 😖',
  '👍 👎 👊 ✊ 🤛',
  '🙄 ✋ 🤚 🖐 🖖',
  '👍🏼 👎🏼 👊🏼 ✊🏼 🤛🏼',
  '☝🏽 ✋🏽 🤚🏽 🖐🏽 🖖🏽',
  '🌖 🌗 🌘 🌑 🌒',
  '💫 💥 💢 💦 💧',
  '🐠 🐟 🐬 🐳 🐋',
  '😬 😐 😕 😯 😶',
  '😇 😏 😑 😓 😵',
  '🐥 🐣 🐔 🐛 🐤',
  '💪 ✨ 🔔 ✊ ✋',
  '👇 👊 👍 👈 👆',
  '💛 👐 👎 👌 💘',
  '👍🏼 👎🏼 👊🏼 ✊🏼 🤛🏼',
  '☝🏽 ✋🏽 🤚🏽 🖐🏽 🖖🏽',
  '🌖 🌗 🌘 🌑 🌒',
  '💫 💥 💢 💦 💧',
  '🐠 🐟 🐬 🐳 🐋',
  '😬 😐 😕 😯 😶',
  '😇 😏 😑 😓 😵',
  '🐥 🐣 🐔 🐛 🐤',
  '💪 ✨ 🔔 ✊ ✋',
  '👇 👊 👍 👈 👆',
  '💛 👐 👎 👌 💘',
]

const handleClick = (item) => {
  window.alert(item)
}

const Default = () => {
  const scrollRef = useRef(null)
  const bs = useRef(null)

  useEffect(() => {
    if (!bs.current) {
      const BS = (bs.current = new BScroll(scrollRef.current, {
        probeType: 3,
        click: true,
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
    <div className="core-container view">
      <div className="scroll-wrapper" ref={scrollRef}>
        <div className="scroll-content">
          {emojis.map((item, index) => (
            <div
              key={index}
              className="scroll-item"
              onClick={() => handleClick(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Default
