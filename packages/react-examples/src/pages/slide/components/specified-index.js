import React, { useState, useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

BScroll.use(Slide)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(4)

const SpecifiedIndex = () => {
  const [slideCreated, setSlideCreated] = useState(false)
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
          startPageXIndex: 2, // v2.3.0
        },
        momentum: false,
        bounce: false,
        probeType: 3,
      }))

      setCurrentPageIndex(BS.getCurrentPage().pageX)
      setSlideCreated(true)

      // v2.1.0
      BS.on('slidePageChanged', (page) => {
        console.log('CurrentPage changed to => ', page)
        setCurrentPageIndex(page.pageX)
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
    <div className="slide-specified-index view">
      <div className="banner-wrapper">
        <div className="slide-specified-wrapper" ref={wrapperRef}>
          <div className="slide-specified-content">
            {nums.map((num) => (
              <div key={num} className={`slide-page page${num}`}>
                page {num}
              </div>
            ))}
          </div>
        </div>
      </div>
      {slideCreated && (
        <div className="description">
          currentPageIndex is {currentPageIndex}
        </div>
      )}

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

export default SpecifiedIndex
