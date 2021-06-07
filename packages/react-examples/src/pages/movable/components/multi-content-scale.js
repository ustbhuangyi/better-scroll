import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Movable from '@better-scroll/movable'
import Zoom from '@better-scroll/zoom'

import SwordsmanLink from './ftstr.png'
import WitchLink from './qos_crop.png'

BScroll.use(Movable)
BScroll.use(Zoom)

const MultiContentScale = () => {
  const wrapperRef = useRef(null)
  const scrollRef2 = useRef(null)

  useEffect(() => {
    const BS1 = new BScroll(wrapperRef.current, {
      bindToTarget: true,
      scrollX: true,
      scrollY: true,
      freeScroll: true,
      movable: true,
      zoom: {
        start: 1.2,
        min: 0.5,
        max: 3,
      },
    })
    BS1.putAt('center', 'center', 0)

    const BS2 = (scrollRef2.current = new BScroll(wrapperRef.current, {
      // use wrapper.children[1] as content
      specifiedIndexAsContent: 1,
      bindToTarget: true,
      scrollX: true,
      scrollY: true,
      freeScroll: true,
      movable: true,
      startY: 150,
      zoom: {
        start: 1,
        min: 0.5,
        max: 3,
      },
    }))

    return () => {
      BS1.destroy()
      BS2.destroy()
    }
  }, [])

  const handleClick = () => {
    scrollRef2.current.putAt('right', 'bottom', 500)
  }

  return (
    <div className="movable-multi-content-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="scroll-content content1">
          <figure>
            <figcaption>Cold Oasis</figcaption>
            <img className="picture" src={SwordsmanLink} alt="ftstr" />
          </figure>
        </div>
        <div className="scroll-content content2">
          <figure>
            <figcaption>Warm Oasis</figcaption>
            <img className="picture" src={WitchLink} alt="qos_crop" />
          </figure>
        </div>
      </div>
      <button className="btn" onClick={handleClick}>
        Put The Warm at center position
      </button>
    </div>
  )
}

export default MultiContentScale
