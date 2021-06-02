import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'

BScroll.use(NestedScroll)

const outerOpenData = ['👈🏻  outer 👉🏻 ', '🙂 🤔 😄 🤨 😐 🙃 ']

const outerCloseData = ['😔 😕 🙃 🤑 😲 😲 ', '👈🏻  outer 👉🏻 ']

const innerData = [
  '👈🏻  inner 👉🏻  ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👈🏻  inner 👉🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '👈🏻  inner 👉🏻 ',
  '🐣 🐣 🐣 🐣 🐣 🐣 ',
  '👈🏻  inner 👉🏻 ',
  '🐥 🐥 🐥 🐥 🐥 🐥 ',
]

const handleOuterClick = () => {
  alert('clicked outer item')
}

const handleInnerClick = () => {
  alert('clicked inner item')
}

const Horizontal = () => {
  const outerWrapperRef = useRef(null)
  const outerScrollRef = useRef(null)
  const innerWrapperRef = useRef(null)
  const innerScrollRef = useRef(null)

  useEffect(() => {
    if (!outerScrollRef.current) {
      outerScrollRef.current = new BScroll(outerWrapperRef.current, {
        nestedScroll: {
          groupId: 'horizontal-nested-scroll', // groupId is a string or number
        },
        scrollX: true,
        scrollY: false,
        click: true,
      })
    }
    if (!innerScrollRef.current) {
      innerScrollRef.current = new BScroll(innerWrapperRef.current, {
        // please keep the same groupId as above
        // outerScroll and innerScroll will be controlled by the same nestedScroll instance
        nestedScroll: {
          groupId: 'horizontal-nested-scroll',
        },
        scrollX: true,
        scrollY: false,
        click: true,
      })
    }

    return () => {
      outerScrollRef.current?.destroy()
      innerScrollRef.current?.destroy()
    }
  }, [])

  return (
    <div className="view">
      <div className="horizontal">
        <div className="outer-wrapper" ref={outerWrapperRef}>
          <div className="outer-content">
            <ul>
              {outerOpenData.map((item, index) => (
                <li
                  key={index}
                  className="list-item"
                  onClick={handleOuterClick}
                >
                  {item}
                </li>
              ))}
              <li className="list-item inner-list-item">
                <div className="inner-wrapper" ref={innerWrapperRef}>
                  <ul className="inner-content">
                    {innerData.map((item, index) => (
                      <li
                        key={index}
                        className="list-item"
                        onClick={handleInnerClick}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              {outerCloseData.map((item, index) => (
                <li
                  key={index}
                  className="list-item"
                  onClick={handleOuterClick}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Horizontal
