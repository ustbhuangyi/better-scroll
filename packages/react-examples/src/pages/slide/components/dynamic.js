import React, { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)

const Dynamic = () => {
  const [num, setNum] = useState(1)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        scrollX: true,
        scrollY: false,
        slide: {
          autoplay: false,
          loop: true,
        },
        momentum: false,
        bounce: false,
        probeType: 3,
      }))

      BS.on('scrollEnd', () => {
        console.log('【scrollEnd】CurrentPage => ', BS.getCurrentPage())
      })
      BS.on('slideWillChange', (page) => {
        console.log('【slideWillChange】CurrentPage =>', page)
        setCurrentPageIndex(page.pageX)
      })
      // v2.1.0
      BS.on('slidePageChanged', (page) => {
        console.log('【slidePageChanged】CurrentPage =>', page)
      })
    }

    return () => {
      scrollRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.refresh()
  }, [num])

  const handleIncrease = () => {
    setNum((n) => n + 1)
  }
  const handleDecrease = () => {
    setNum((n) => Math.max(1, n - 1))
  }

  return (
    <div className="dynamic-slide-banner view">
      <div className="banner-wrapper">
        <div className="slide-banner-wrapper" ref={wrapperRef}>
          <div className="slide-banner-content">
            {createArray(num).map((n) => (
              <div key={n} className={`slide-page page${n}`}>
                page {n}
              </div>
            ))}
          </div>
        </div>
        <div className="dots-wrapper">
          {createArray(num).map((n) => (
            <span
              key={n}
              className={classNames('dot', {
                active: currentPageIndex === n - 1,
              })}
            ></span>
          ))}
        </div>
      </div>
      <div className="btn-wrap">
        <button onClick={handleIncrease} className="increase">
          increase
        </button>
        <button onClick={handleDecrease} className="decrease">
          decrease
        </button>
      </div>
    </div>
  )
}

export default Dynamic
