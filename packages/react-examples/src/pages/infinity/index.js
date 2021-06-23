import React, { useRef, useEffect } from 'react'
import BScroll from '@better-scroll/core'
import InfinityScroll from '@better-scroll/infinity'

import message from './data/message.json'

import './index.styl'

BScroll.use(InfinityScroll)

const NUM_AVATARS = 4
const NUM_IMAGES = 77
const INIT_TIME = new Date().getTime()

function getItem(id) {
  function pickRandom(a) {
    return a[Math.floor(Math.random() * a.length)]
  }

  return new Promise((resolve) => {
    const item = {
      id: id,
      avatar: Math.floor(Math.random() * NUM_AVATARS),
      self: Math.random() < 0.1,
      image:
        Math.random() < 1.0 / 20 ? Math.floor(Math.random() * NUM_IMAGES) : '',
      time: new Date(
        Math.floor(INIT_TIME + id * 20 * 1000 + Math.random() * 20 * 1000)
      ),
      message: pickRandom(message),
    }
    if (item.image === '') {
      resolve(item)
    } else {
      let image = new Image()
      image.src = require(`./image/image${item.image}.jpg`)
      image.addEventListener('load', function () {
        item.image = image
        resolve(item)
      })
      image.addEventListener('error', function () {
        item.image = ''
        resolve(item)
      })
    }
  })
}

let nextItem = 0
let pageNum = 0

const InfinityPage = () => {
  const messageRef = useRef(null)
  const tombstoneRef = useRef(null)
  const wrapperRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!scrollRef.current) {
      const BS = (scrollRef.current = new BScroll(wrapperRef.current, {
        infinity: {
          render: (item, div) => {
            div = div || messageRef.current.cloneNode(true)
            div.dataset.id = item.id
            div.querySelector(
              '.infinity-avatar'
            ).src = require(`./image/avatar${item.avatar}.jpg`)
            div.querySelector('.infinity-bubble p').textContent =
              item.id + '  ' + item.message
            div.querySelector(
              '.infinity-bubble .infinity-posted-date'
            ).textContent = item.time.toString()

            let img = div.querySelector('.infinity-bubble img')
            if (item.image !== '') {
              img.style.display = ''
              img.src = item.image.src
              img.width = item.image.width
              img.height = item.image.height
            } else {
              img.src = ''
              img.style.display = 'none'
            }

            if (item.self) {
              div.classList.add('infinity-from-me')
            } else {
              div.classList.remove('infinity-from-me')
            }
            return div
          },
          createTombstone: () => tombstoneRef.current.cloneNode(true),
          fetch: (count) => {
            count = Math.max(30, count)
            return new Promise((resolve, reject) => {
              // Assume 50 ms per item.
              setTimeout(() => {
                if (++pageNum > 20) {
                  resolve(false)
                } else {
                  console.log('pageNum', pageNum)
                  let items = []
                  for (let i = 0; i < Math.abs(count); i++) {
                    items[i] = getItem(nextItem++)
                  }
                  resolve(Promise.all(items))
                }
              }, 500)
            })
          },
        },
      }))

      BS.on('scroll', () => {
        console.log('is scrolling')
      })
      BS.on('scrollEnd', () => {
        console.log('scrollEnd')
      })
    }
  }, [])

  return (
    <div className="infinity view">
      <div className="template">
        <li ref={messageRef} className="infinity-item">
          <img className="infinity-avatar" width="48" height="48" alt="" />
          <div className="infinity-bubble">
            <p></p>
            <img width="300" height="300" alt="" />
            <div className="infinity-meta">
              <time className="infinity-posted-date"></time>
            </div>
          </div>
        </li>
        <li ref={tombstoneRef} className="infinity-item tombstone">
          <img
            className="infinity-avatar"
            width="48"
            height="48"
            src={require('./image/unknown.jpg')}
            alt=""
          />
          <div className="infinity-bubble">
            <p></p>
            <p></p>
            <p></p>
            <div className="infinity-meta">
              <time className="infinity-posted-date"></time>
            </div>
          </div>
        </li>
      </div>
      <div ref={wrapperRef} className="infinity-timeline">
        <ul></ul>
      </div>
    </div>
  )
}

export default InfinityPage
