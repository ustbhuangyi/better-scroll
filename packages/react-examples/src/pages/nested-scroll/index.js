import React from 'react'

import './index.styl'

const examples = [
  {
    path: '/nested-scroll/vertical',
    name: 'vertical',
  },
  {
    path: '/nested-scroll/horizontal',
    name: 'horizontal',
  },
  {
    path: '/nested-scroll/horizontal-in-vertical',
    name: 'horizontal-in-vertical',
  },
  {
    path: '/nested-scroll/triple-vertical',
    name: 'triple-vertical',
  },
]

const NestedScroll = (props) => {
  const goPage = (path) => {
    props.history.push(path)
  }

  return (
    <div className="view">
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

export default NestedScroll
