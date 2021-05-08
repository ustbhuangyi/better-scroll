import React from 'react'

import './index.styl'

const examples = [
  {
    path: '/slide/banner',
    name: 'banner slide',
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
