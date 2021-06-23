import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(4)

const Banner = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollX: true,
        scrollY: false,
        slide: true,
        momentum: false,
        bounce: false,
        probeType: 3,
      }))

      BS.on('scrollEnd', () => {
        console.log('CurrentPage => ', BS.getCurrentPage())
      })
      BS.on('slideWillChange', (page) => {
        setCurrentPageIndex(page.pageX)
      })
      // v2.1.0
      BS.on('slidePageChanged', (page) => {
        console.log('CurrentPage changed to => ', page)
      })
    }

    return () => {
      scrollRef.current?.destroy()
    }
  }, [])

  const handleNextPage = () => {
    scrollRef.current.next()
  }
  const handlePrePage = () => {
    scrollRef.current.prev()
  }

  return (
    <div className="slide-banner view">
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
      <div className="btn-wrap">
        <button className="next" onClick={handleNextPage}>
          nextPage
        </button>
        <button className="prev" onClick={handlePrePage}>
          prePage
        </button>
      </div>
    </div>
  )
}

export default Banner
