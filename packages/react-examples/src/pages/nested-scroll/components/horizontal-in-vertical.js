import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import NestedScroll from '@better-scroll/nested-scroll'
import Slide from '@better-scroll/slide'

BScroll.use(NestedScroll)
BScroll.use(Slide)

const outerOpenData = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
]

const outerCloseData = [
  '😀 😁 😂 🤣 😃 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤣 😲 🙃 🤣',
  '🙂 🤔 😄 🤨  😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤣 😲 🙃 🤣',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤣 😲 🙃 🤣',
  '🙂 🤔 😄 🤨 😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤣 😲 🙃 🤣',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤣 😲 🙃 🤣',
  '🙂 🤔 😄 🤨  😐 🙃 ',
  '👆🏻 vertical scroll 👇🏻 ',
  '😔 😕 🙃 🤣 😲 🙃 🤣',
]

const handleOuterClick = () => {
  alert('clicked outer item')
}

const handleInnerClick = () => {
  alert('clicked inner item')
}

const HorizontalInVertical = () => {
  const outerWrapperRef = useRef(null)
  const outerScrollRef = useRef(null)
  const innerWrapperRef = useRef(null)
  const innerScrollRef = useRef(null)

  useEffect(() => {
    if (!outerScrollRef.current) {
      outerScrollRef.current = new BScroll(outerWrapperRef.current, {
        nestedScroll: {
          groupId: 'mixed-nested-scroll',
        },
        click: true,
      })
    }
    if (!innerScrollRef.current) {
      innerScrollRef.current = new BScroll(innerWrapperRef.current, {
        nestedScroll: {
          groupId: 'mixed-nested-scroll',
        },
        scrollX: true,
        scrollY: false,
        slide: {
          loop: false,
          autoplay: false,
          threshold: 100,
        },
        momentum: false,
        bounce: false,
        click: true,
      })
    }

    return () => {
      outerScrollRef.current?.destroy()
      innerScrollRef.current?.destroy()
    }
  }, [])

  return (
    <div className="horizontal-in-vertical-container view">
      <div className="vertical-wrapper" ref={outerWrapperRef}>
        <div className="vertical-content">
          {outerOpenData.map((item, index) => (
            <li
              key={index}
              className="vertical-item"
              onClick={handleOuterClick}
            >
              {item}
            </li>
          ))}
          <div className="horizontal-wrapper" ref={innerWrapperRef}>
            <div className="slide-banner-content" onClick={handleInnerClick}>
              <div className="slide-item page1">horizontal scroll 1</div>
              <div className="slide-item page2">horizontal scroll 2</div>
              <div className="slide-item page3">horizontal scroll 3</div>
              <div className="slide-item page4">horizontal scroll 4</div>
            </div>
          </div>
          {outerCloseData.map((item, index) => (
            <div
              key={index}
              className="vertical-item"
              onClick={handleOuterClick}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HorizontalInVertical
