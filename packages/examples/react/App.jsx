import React from 'react'
import { HashRouter } from 'react-router-dom'

import Router from './router.jsx'

const App = () => {
  return (
    <>
      <section className="page-header">
        <h1 className="project-name">BetterScroll</h1>
        <h2 className="project-tagline">
          inspired by iscroll, and it has a better scroll perfermance
        </h2>
      </section>
      <HashRouter>
        <Router />
      </HashRouter>
    </>
  )
}

export default App
