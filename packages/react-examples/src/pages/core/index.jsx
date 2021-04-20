import React from 'react'

import './index.styl'

const Core = (props) => {
  const goPage = (path) => {
    props.history.push(path)
  }

  return (
    <div className="view core">
      <ul className="example-list">
        <li className="example-item" onClick={() => goPage('/core/default')}>
          <span>vertical</span>
        </li>
        <li className="example-item" onClick={() => goPage('/core/horizontal')}>
          <span>horizontal</span>
        </li>
        <li
          className="example-item"
          onClick={() => goPage('/core/dynamic-content')}
        >
          <span>dynamic-content</span>
        </li>
        <li
          className="example-item"
          onClick={() => goPage('/core/specified-content')}
        >
          <span>specified-content</span>
        </li>
        <li className="example-item" onClick={() => goPage('/core/freescroll')}>
          <span>freescroll</span>
        </li>
      </ul>
      {props.children}
    </div>
  )
}

export default Core
