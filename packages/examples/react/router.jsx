import React, { lazy, Suspense } from 'react'
import { Switch, Route } from 'react-router-dom'

const ROUTES = [
  {
    path: '/core',
    component: lazy(() => import('./pages/core')),
    routes: [
      {
        path: '/core/default',
        component: lazy(() => import('./pages/core/components/default')),
      },
      {
        path: '/core/horizontal',
        component: lazy(() => import('./pages/core/components/horizontal')),
      },
      {
        path: '/core/dynamic-content',
        component: lazy(() =>
          import('./pages/core/components/dynamic-content')
        ),
      },
      {
        path: '/core/specified-content',
        component: lazy(() =>
          import('./pages/core/components/specified-content')
        ),
      },
      {
        path: '/core/freescroll',
        component: lazy(() => import('./pages/core/components/freescroll')),
      },
    ],
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
