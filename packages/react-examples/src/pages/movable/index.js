import React from 'react'

import './index.styl'

const examples = [
  {
    path: '/movable/default',
    name: 'default',
  },
  {
    path: '/movable/scale',
    name: 'scale',
  },
  {
    path: '/movable/multi-content',
    name: 'multi-content',
  },
  {
    path: '/movable/multi-content-scale',
    name: 'multi-content-scale',
  },
]

const Movable = (props) => {
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

export default Movable
