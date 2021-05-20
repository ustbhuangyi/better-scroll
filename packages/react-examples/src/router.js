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
      {
        path: '/core/vertical-rotated',
        component: lazy(() =>
          import('./pages/core/components/vertical-rotated')
        ),
      },
      {
        path: '/core/horizontal-rotated',
        component: lazy(() =>
          import('./pages/core/components/horizontal-rotated')
        ),
      },
    ],
  },
  {
    path: '/observe-dom',
    component: lazy(() => import('./pages/observe-dom')),
    routes: [
      {
        path: '/observe-dom/',
        component: lazy(() => import('./pages/observe-dom/components/default')),
      },
    ],
  },
  {
    path: '/observe-image',
    component: lazy(() => import('./pages/observe-image')),
    routes: [
      {
        path: '/observe-image/',
        component: lazy(() =>
          import('./pages/observe-image/components/default')
        ),
      },
    ],
  },
  {
    path: '/slide',
    component: lazy(() => import('./pages/slide')),
    routes: [
      {
        path: '/slide/banner',
        component: lazy(() => import('./pages/slide/components/banner')),
      },
      {
        path: '/slide/fullpage',
        component: lazy(() => import('./pages/slide/components/fullpage')),
      },
      {
        path: '/slide/vertical',
        component: lazy(() => import('./pages/slide/components/vertical')),
      },
      {
        path: '/slide/dynamic',
        component: lazy(() => import('./pages/slide/components/dynamic')),
      },
      {
        path: '/slide/specified',
        component: lazy(() =>
          import('./pages/slide/components/specified-index')
        ),
      },
    ],
  },
  {
    path: '/zoom',
    component: lazy(() => import('./pages/zoom')),
    routes: [
      {
        path: '/zoom/',
        component: lazy(() => import('./pages/zoom/components/default')),
      },
    ],
  },
  {
    path: '/picker',
    component: lazy(() => import('./pages/picker')),
    routes: [
      {
        path: '/picker/one-column',
        component: lazy(() => import('./pages/picker/components/one-column')),
      },
      {
        path: '/picker/double-column',
        component: lazy(() =>
          import('./pages/picker/components/double-column')
        ),
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

const RouterView = () => (
  <Suspense fallback={null}>
    <Router routes={ROUTES} />
  </Suspense>
)

export default RouterView
