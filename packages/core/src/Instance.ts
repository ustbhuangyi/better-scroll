import { Behavior } from './scroller/Behavior'
import Actions from './scroller/Actions'
import { ExposedAPI as ExposedAPIByScroller } from './scroller/Scroller'
import { Animater } from './animater'
import { ExposedAPI as ExposedAPIByAnimater } from './animater/Base'

export interface BScrollInstance
  extends ExposedAPIByScroller,
    ExposedAPIByAnimater {
  [key: string]: any
  x: Behavior['currentPos']
  y: Behavior['currentPos']
  hasHorizontalScroll: Behavior['hasScroll']
  hasVerticalScroll: Behavior['hasScroll']
  scrollerWidth: Behavior['contentSize']
  scrollerHeight: Behavior['contentSize']
  maxScrollX: Behavior['maxScrollPos']
  maxScrollY: Behavior['maxScrollPos']
  minScrollX: Behavior['minScrollPos']
  minScrollY: Behavior['minScrollPos']
  movingDirectionX: Behavior['movingDirection']
  movingDirectionY: Behavior['movingDirection']
  directionX: Behavior['direction']
  directionY: Behavior['direction']
  enabled: Actions['enabled']
  pending: Animater['pending']
}

export const propertiesConfig = [
  {
    sourceKey: 'scroller.scrollBehaviorX.currentPos',
    key: 'x'
  },
  {
    sourceKey: 'scroller.scrollBehaviorY.currentPos',
    key: 'y'
  },
  {
    sourceKey: 'scroller.scrollBehaviorX.hasScroll',
    key: 'hasHorizontalScroll'
  },
  {
    sourceKey: 'scroller.scrollBehaviorY.hasScroll',
    key: 'hasVerticalScroll'
  },
  {
    sourceKey: 'scroller.scrollBehaviorX.contentSize',
    key: 'scrollerWidth'
  },
  {
    sourceKey: 'scroller.scrollBehaviorY.contentSize',
    key: 'scrollerHeight'
  },
  {
    sourceKey: 'scroller.scrollBehaviorX.maxScrollPos',
    key: 'maxScrollX'
  },
  {
    sourceKey: 'scroller.scrollBehaviorY.maxScrollPos',
    key: 'maxScrollY'
  },
  {
    sourceKey: 'scroller.scrollBehaviorX.minScrollPos',
    key: 'minScrollX'
  },
  {
    sourceKey: 'scroller.scrollBehaviorY.minScrollPos',
    key: 'minScrollY'
  },
  {
    sourceKey: 'scroller.scrollBehaviorX.movingDirection',
    key: 'movingDirectionX'
  },
  {
    sourceKey: 'scroller.scrollBehaviorY.movingDirection',
    key: 'movingDirectionY'
  },
  {
    sourceKey: 'scroller.scrollBehaviorX.direction',
    key: 'directionX'
  },
  {
    sourceKey: 'scroller.scrollBehaviorY.direction',
    key: 'directionY'
  },
  {
    sourceKey: 'scroller.actions.enabled',
    key: 'enabled'
  },
  {
    sourceKey: 'scroller.animater.pending',
    key: 'pending'
  },
  {
    sourceKey: 'scroller.animater.stop',
    key: 'stop'
  },
  {
    sourceKey: 'scroller.scrollTo',
    key: 'scrollTo'
  },
  {
    sourceKey: 'scroller.scrollBy',
    key: 'scrollBy'
  },
  {
    sourceKey: 'scroller.scrollToElement',
    key: 'scrollToElement'
  },
  {
    sourceKey: 'scroller.resetPosition',
    key: 'resetPosition'
  }
]
