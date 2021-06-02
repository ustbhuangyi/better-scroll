import { useHistory } from 'react-router-dom'

import Router from './router'

const examples = [
  {
    name: 'core scroll',
    path: '/core/',
  },
  {
    name: 'observe-dom',
    path: '/observe-dom/',
  },
  {
    name: 'observe-image',
    path: '/observe-image/',
  },
  {
    name: 'slide',
    path: '/slide',
  },
  {
    name: 'zoom',
    path: '/zoom/',
  },
  {
    name: 'picker',
    path: '/picker/',
  },
  {
    name: 'pullup',
    path: '/pullup/',
  },
  {
    name: 'pulldown',
    path: '/pulldown/',
  },
  {
    name: 'scrollbar',
    path: '/scrollbar',
  },
  {
    name: 'indicators',
    path: '/indicators',
  },
  {
    name: 'infinity',
    path: '/infinity',
  },
  {
    name: 'form',
    path: '/form',
  },
  {
    name: 'nested-scroll',
    path: '/nested-scroll',
  },
]

const App = () => {
  const history = useHistory()

  const goPage = (path) => {
    history.push(path)
  }

  return (
    <>
      <section className="page-header">
        <h1 className="project-name">BetterScroll</h1>
        <h2 className="project-tagline">
          inspired by iscroll, and it has a better scroll perfermance
        </h2>
      </section>
      <section className="main-content">
        <div className="example">
          <ul className="example-list">
            {examples.map((item) => (
              <li
                key={item.name}
                className="example-item"
                onClick={() => goPage(item.path)}
              >
                <span>{item.name}</span>
              </li>
            ))}

            <li className="example-item placeholder"></li>
          </ul>
        </div>
      </section>
      <Router />
    </>
  )
}

export default App
