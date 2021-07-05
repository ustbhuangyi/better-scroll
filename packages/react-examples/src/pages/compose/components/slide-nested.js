import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'
import Slide from '@better-scroll/slide'

BScroll.use(NestedScroll)
BScroll.use(Slide)

const DATA = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
  '🙂 🤔 😄 🤨  😐 🙃 ',
  '👆🏻 outer scroll 👇🏻 ',
  '😔 😕 🙃 🤑 😲 ☹️ ',
]

const NestedScrollPage = () => {
  const outerWrapperRef = useRef(null)
  const innerWrapperRef = useRef(null)

  useEffect(() => {
    const outerScrollRef = new BScroll(outerWrapperRef.current, {
      nestedScroll: {
        groupId: 'slide-nested',
      },
    })

    const innerScrollRef = new BScroll(innerWrapperRef.current, {
      nestedScroll: {
        groupId: 'slide-nested',
      },
      scrollX: true,
      scrollY: false,
      momentum: false,
      // close bounce effects
      bounce: {
        top: false,
        bottom: false,
      },
      slide: {
        loop: true,
        autoplay: false,
      },
    })

    return () => {
      outerScrollRef.destroy()
      innerScrollRef.destroy()
    }
  }, [])

  return (
    <div className="slide-nested view">
      <div className="outer-wrapper" ref={outerWrapperRef}>
        <div className="outer-content">
          <ul>
            {DATA.map((item, index) => (
              <li key={index} className="outer-list-item">
                {item}
              </li>
            ))}
          </ul>
          <div className="inner-wrapper" ref={innerWrapperRef}>
            <div className="slide-banner-content">
              <div className="slide-item page1">page 1</div>
              <div className="slide-item page2">page 2</div>
              <div className="slide-item page3">page 3</div>
              <div className="slide-item page4">page 4</div>
            </div>
          </div>
          <ul>
            {DATA.map((item, index) => (
              <li key={index} className="outer-list-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NestedScrollPage
