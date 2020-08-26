import { Options as BScrollOptions } from '../Options'
import { Options as ActionsHandlerOptions } from '../base/ActionsHandler'
import { Options as BehaviorOptions, Bounces, Rect } from './Behavior'

export function createActionsHandlerOptions(bsOptions: BScrollOptions) {
  const options = [
    'click',
    'bindToWrapper',
    'disableMouse',
    'disableTouch',
    'preventDefault',
    'stopPropagation',
    'tagException',
    'preventDefaultException',
    'autoEndDistance',
  ].reduce<ActionsHandlerOptions>((prev, cur) => {
    prev[cur] = bsOptions[cur]
    return prev
  }, {} as ActionsHandlerOptions)
  return options
}

export function createBehaviorOptions(
  bsOptions: BScrollOptions,
  extraProp: 'scrollX' | 'scrollY',
  bounces: Bounces,
  rect: Rect
) {
  const options = [
    'momentum',
    'momentumLimitTime',
    'momentumLimitDistance',
    'deceleration',
    'swipeBounceTime',
    'swipeTime',
    'outOfBoundaryDampingFactor',
  ].reduce<BehaviorOptions>((prev, cur) => {
    prev[cur] = bsOptions[cur]
    return prev
  }, {} as BehaviorOptions)
  // add extra property
  options.scrollable = !!bsOptions[extraProp]
  options.bounces = bounces
  options.rect = rect
  return options
}
