import React from 'react'

import './index.styl'

const examples = [
  {
    path: '/core/default',
    name: 'vertical',
  },
  {
    path: '/core/horizontal',
    name: 'horizontal',
  },
  {
    path: '/core/dynamic-content',
    name: 'dynamic-content',
  },
  {
    path: '/core/specified-content',
    name: 'specified-content',
  },
  {
    path: '/core/freescroll',
    name: 'freescroll',
  },
  {
    path: '/core/vertical-rotated',
    name: 'vertical-rotated(v2.3.0)',
  },
  {
    path: '/core/horizontal-rotated',
    name: 'horizontal-rotated(v2.3.0)',
  },
]

const Core = (props) => {
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

export default Core
