import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(4)

const FullPage = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollX: true,
        scrollY: false,
        slide: {
          threshold: 100,
          loop: false,
          autoplay: false,
        },
        useTransition: false,
        momentum: false,
        bounce: false,
        stopPropagation: true,
      }))

      BS.on('scrollEnd', () => {
        setCurrentPageIndex(BS.getCurrentPage().pageX)
      })
    }

    return () => {
      scrollRef.current?.destroy()
    }
  }, [])

  return (
    <div className="slide-fullpage view">
      <div className="banner-wrapper">
        <div className="slide-banner-wrapper" ref={wrapperRef}>
          <div className="slide-banner-content">
            {nums.map((num) => (
              <div key={num} className={`slide-page page${num}`}>
                page {num}
              </div>
            ))}
          </div>
        </div>
        <div className="dots-wrapper">
          {nums.map((num) => (
            <span
              key={num}
              className={classNames('dot', {
                active: currentPageIndex === num - 1,
              })}
            ></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FullPage
