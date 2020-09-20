import {
  createActionsHandlerOptions,
  createBehaviorOptions,
} from '../createOptions'
import { OptionsConstructor } from '../../Options'

jest.mock('../../Options')

describe('createOptions helper function tests', () => {
  let bsOptions: any
  beforeEach(() => {
    bsOptions = new OptionsConstructor()
  })
  it('should return correct object when invoking createActionsHandlerOptions function', () => {
    let ret = createActionsHandlerOptions(bsOptions)

    expect(ret).toEqual({
      click: false,
      bindToWrapper: false,
      disableMouse: true,
      preventDefault: true,
      stopPropagation: false,
      preventDefaultException: {
        tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/,
      },
    })
  })

  it('should return correct object when invoking createBehaviorOptions function', () => {
    let ret = createBehaviorOptions(bsOptions, 'scrollY', [true, true], {
      size: 'width',
      position: 'top',
    })

    expect(ret).toEqual({
      momentum: true,
      momentumLimitTime: 300,
      momentumLimitDistance: 15,
      deceleration: 0.0015,
      swipeBounceTime: 500,
      swipeTime: 2500,
      scrollable: true,
      outOfBoundaryDampingFactor: 1 / 3,
      specifiedIndexAsContent: 0,
      bounces: [true, true],
      rect: {
        size: 'width',
        position: 'top',
      },
    })
  })
})
