import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Movable from '@better-scroll/movable'

import picture1 from './oasis_one.png'
import picture2 from './oasis_two.png'

BScroll.use(Movable)

const MultiContent = () => {
  const wrapperRef = useRef(null)
  const scrollRef2 = useRef(null)

  useEffect(() => {
    const BS1 = new BScroll(wrapperRef.current, {
      bindToTarget: true,
      scrollX: true,
      scrollY: true,
      freeScroll: true,
      movable: true,
      startX: 10,
      startY: 10,
    })

    const BS2 = (scrollRef2.current = new BScroll(wrapperRef.current, {
      // use wrapper.children[1] as content
      specifiedIndexAsContent: 1,
      bindToTarget: true,
      scrollX: true,
      scrollY: true,
      freeScroll: true,
      movable: true,
      startX: 0,
      startY: 170,
    }))

    return () => {
      BS1.destroy()
      BS2.destroy()
    }
  }, [])

  const handleClick = () => {
    scrollRef2.current.putAt('center', 'center')
  }

  return (
    <div className="movable-multi-content-container view">
      <div className="scroll-wrapper" ref={wrapperRef}>
        <div className="scroll-content content1">
          <figure>
            <figcaption>Cold Oasis</figcaption>
            <img className="picture" src={picture1} alt="Cold Oasis" />
          </figure>
        </div>
        <div className="scroll-content content2">
          <figure>
            <figcaption>Warm Oasis</figcaption>
            <img className="picture" src={picture2} alt="Warm Oasis" />
          </figure>
        </div>
      </div>
      <button className="btn" onClick={handleClick}>
        Put The Warm at center position
      </button>
    </div>
  )
}

export default MultiContent
