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
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
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
  }, [])

  return (
    <div className="core-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
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
