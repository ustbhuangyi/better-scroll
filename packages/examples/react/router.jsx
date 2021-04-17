import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'

const ROUTES = [
  {
    path: '/core',
    component: lazy(() => import('./pages/core')),
  },
]

const renderRoute = (route) => {
  const { component: Component, ...rest } = route
  return (
    <Route
      {...rest}
      key={route.path}
      render={(props) => (
        <Component {...props}>
          <Router routes={route.routes}></Router>
        </Component>
      )}
    />
  )
}

const Router = ({ routes }) => {
  if (!routes?.length) {
    return null
  }
  return <Switch>{routes.map((route) => renderRoute(route))}</Switch>
}

export default () => (
  <Suspense fallback={null}>
    <Router routes={ROUTES} />
  </Suspense>
)
