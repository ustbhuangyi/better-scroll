import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import ObserveImage from '@better-scroll/observe-image'

BScroll.use(ObserveImage)

const images = [
  'https://dpubstatic.udache.com/static/dpubimg/dEswI1MVy6/zoo.png',
  'https://dpubstatic.udache.com/static/dpubimg/BYb_wPak21/home.png',
  'https://dpubstatic.udache.com/static/dpubimg/B6q1pWB0sB/cabin.png',
  'https://dpubstatic.udache.com/static/dpubimg/76n1ilzf4R/stone.png',
]

const Default = () => {
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      scrollRef.current = new BScroll(wrapperRef.current, {
        observeImage: true,
      })
    }
  }, [])

  return (
    <div className="observe-image-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="scroll-content">
          {images.map((item, index) => (
            <img width="100%" src={item} alt="" key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Default
