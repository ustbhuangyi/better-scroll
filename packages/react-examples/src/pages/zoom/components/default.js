import React, { useRef, useState, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import Zoom from '@better-scroll/zoom'

import good from './good.svg'

BScroll.use(Zoom)

const createArray = (length) => Array.from({ length }, (_v, i) => i + 1)
const nums = createArray(16)

const Default = () => {
  const [linkworkTransform, setLinkworkTransform] = useState('scale(1)')

  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  const handleZoomTo = (value) => {
    scrollRef.current.zoomTo(value, 'center', 'center')
  }

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        freeScroll: true,
        scrollX: true,
        scrollY: true,
        disableMouse: true,
        useTransition: true,
        zoom: {
          start: 1.5,
          min: 0.5,
          max: 3,
          initialOrigin: ['center', 'center'],
        },
      }))

      BS.on('zooming', ({ scale }) => {
        setLinkworkTransform(`scale(${scale})`)
      })

      BS.on('zoomEnd', ({ scale }) => {
        console.log(scale)
      })

      return () => {
        scrollRef.current?.destroy()
      }
    }
  }, [])

  return (
    <div className="zoom-default view">
      <div className="zoom-wrapper" ref={wrapperRef}>
        <div className="zoom-items">
          {nums.map((item, index) => (
            <div key={index} className="grid-item">
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="btn-wrap">
        <button className="zoom-half" onClick={() => handleZoomTo(0.5)}>
          zoomTo:0.5
        </button>
        <button className="zoom-original" onClick={() => handleZoomTo(1)}>
          zoomTo:1
        </button>
        <button className="zoom-double" onClick={() => handleZoomTo(2)}>
          zoomTo:2
        </button>
      </div>
      <div className="linkwork-wrap">
        <p>changing with zooming action</p>
        <div
          className="linkwork-block"
          style={{ transform: linkworkTransform }}
        >
          <img src={good} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Default
