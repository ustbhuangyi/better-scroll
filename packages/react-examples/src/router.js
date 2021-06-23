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
      {
        path: '/picker/linkage-column',
        component: lazy(() =>
          import('./pages/picker/components/linkage-column')
        ),
      },
    ],
  },
  {
    path: '/pullup',
    component: lazy(() => import('./pages/pullup')),
    routes: [
      {
        path: '/pullup/',
        component: lazy(() => import('./pages/pullup/components/default')),
      },
    ],
  },
  {
    path: '/pulldown',
    component: lazy(() => import('./pages/pulldown')),
    routes: [
      {
        path: '/pulldown/',
        component: lazy(() => import('./pages/pulldown/components/default')),
      },
    ],
  },
  {
    path: '/scrollbar',
    component: lazy(() => import('./pages/scrollbar')),
    routes: [
      {
        path: '/scrollbar/vertical',
        component: lazy(() => import('./pages/scrollbar/components/vertical')),
      },
      {
        path: '/scrollbar/horizontal',
        component: lazy(() =>
          import('./pages/scrollbar/components/horizontal')
        ),
      },
      {
        path: '/scrollbar/custom',
        component: lazy(() => import('./pages/scrollbar/components/custom')),
      },
      {
        path: '/scrollbar/mousewheel',
        component: lazy(() =>
          import('./pages/scrollbar/components/mousewheel')
        ),
      },
    ],
  },
  {
    path: '/indicators',
    component: lazy(() => import('./pages/indicators')),
    routes: [
      {
        path: '/indicators/minimap',
        component: lazy(() => import('./pages/indicators/components/minimap')),
      },
      {
        path: '/indicators/parallax-scroll',
        component: lazy(() =>
          import('./pages/indicators/components/parallax-scroll')
        ),
      },
    ],
  },
  {
    path: '/infinity',
    component: lazy(() => import('./pages/infinity')),
  },
  {
    path: '/form',
    component: lazy(() => import('./pages/form')),
    routes: [
      {
        path: '/form/textarea',
        component: lazy(() => import('./pages/form/components/textarea')),
      },
    ],
  },
  {
    path: '/nested-scroll',
    component: lazy(() => import('./pages/nested-scroll')),
    routes: [
      {
        path: '/nested-scroll/vertical',
        component: lazy(() =>
          import('./pages/nested-scroll/components/vertical')
        ),
      },
      {
        path: '/nested-scroll/horizontal',
        component: lazy(() =>
          import('./pages/nested-scroll/components/horizontal')
        ),
      },
      {
        path: '/nested-scroll/horizontal-in-vertical',
        component: lazy(() =>
          import('./pages/nested-scroll/components/horizontal-in-vertical')
        ),
      },
      {
        path: '/nested-scroll/triple-vertical',
        component: lazy(() =>
          import('./pages/nested-scroll/components/triple-vertical')
        ),
      },
    ],
  },
  {
    path: '/mouse-wheel',
    component: lazy(() => import('./pages/mouse-wheel')),
    routes: [
      {
        path: '/mouse-wheel/vertical-scroll',
        component: lazy(() =>
          import('./pages/mouse-wheel/components/vertical-scroll')
        ),
      },
      {
        path: '/mouse-wheel/horizontal-scroll',
        component: lazy(() =>
          import('./pages/mouse-wheel/components/horizontal-scroll')
        ),
      },
      {
        path: '/mouse-wheel/vertical-slide',
        component: lazy(() =>
          import('./pages/mouse-wheel/components/vertical-slide')
        ),
      },
      {
        path: '/mouse-wheel/horizontal-slide',
        component: lazy(() =>
          import('./pages/mouse-wheel/components/horizontal-slide')
        ),
      },
      {
        path: '/mouse-wheel/pullup',
        component: lazy(() => import('./pages/mouse-wheel/components/pullup')),
      },
      {
        path: '/mouse-wheel/pulldown',
        component: lazy(() =>
          import('./pages/mouse-wheel/components/pulldown')
        ),
      },
      {
        path: '/mouse-wheel/picker',
        component: lazy(() => import('./pages/mouse-wheel/components/picker')),
      },
    ],
  },
  {
    path: '/movable',
    component: lazy(() => import('./pages/movable')),
    routes: [
      {
        path: '/movable/default',
        component: lazy(() => import('./pages/movable/components/default')),
      },
      {
        path: '/movable/scale',
        component: lazy(() => import('./pages/movable/components/scale')),
      },
      {
        path: '/movable/multi-content',
        component: lazy(() =>
          import('./pages/movable/components/multi-content')
        ),
      },
      {
        path: '/movable/multi-content-scale',
        component: lazy(() =>
          import('./pages/movable/components/multi-content-scale')
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
