import React from 'react'

import './index.styl'

const examples = [
  {
    path: '/mouse-wheel/vertical-scroll',
    name: 'vertical scroll',
  },
  {
    path: '/mouse-wheel/horizontal-scroll',
    name: 'horizontal scroll',
  },
  {
    path: '/mouse-wheel/vertical-slide',
    name: 'vertical slide',
  },
  {
    path: '/mouse-wheel/horizontal-slide',
    name: 'horizontal slide',
  },
  {
    path: '/mouse-wheel/pullup',
    name: 'pull up load',
  },
  {
    path: '/mouse-wheel/pulldown',
    name: 'pull down refresh',
  },
]

const MouseWheel = (props) => {
  const goPage = (path) => {
    props.history.push(path)
  }

  return (
    <div className="view core">
      <ul className="example-list">
        {examples.map((item) => (
          <li
            className="example-item"
            onClick={() => goPage(item.path)}
            key={item.path}
          >
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
      {props.children}
    </div>
  )
}

export default MouseWheel
