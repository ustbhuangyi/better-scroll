import React from 'react'

import './index.styl'

const examples = [
  {
    path: '/slide/banner',
    name: 'banner slide',
  },
  {
    path: '/slide/fullpage',
    name: 'page slide',
  },
  {
    path: '/slide/vertical',
    name: 'vertical slide',
  },
  {
    path: '/slide/dynamic',
    name: 'dynamic slide（v2.1.0）',
  },
  {
    path: '/slide/specified',
    name: 'specified index slide（v2.3.0）',
  },
]

const Core = (props) => {
  const goPage = (path) => {
    props.history.push(path)
  }

  return (
    <div className="view slide">
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
