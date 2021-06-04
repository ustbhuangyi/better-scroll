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
