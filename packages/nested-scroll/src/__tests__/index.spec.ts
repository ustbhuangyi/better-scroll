import BScroll from '@better-scroll/core'
jest.mock('@better-scroll/core')

import NestedScroll, { DEFAUL_GROUP_ID } from '../index'

const addProperties = <T extends Object, K extends Object>(
  target: T,
  source: K
) => {
  for (const key in source) {
    ;(target as any)[key] = source[key]
  }
  return target
}

describe('NestedScroll tests', () => {
  let parentWrapper: HTMLElement
  let parentContent: HTMLElement
  let childWrapper: HTMLElement
  let childContent: HTMLElement
  let grandsonWrapper: HTMLElement
  let grandsonContent: HTMLElement
  beforeEach(() => {
    parentWrapper = document.createElement('div')
    parentContent = document.createElement('div')

    childWrapper = document.createElement('div')
    childContent = document.createElement('div')

    grandsonWrapper = document.createElement('div')
    grandsonContent = document.createElement('div')

    parentWrapper.appendChild(parentContent)
    parentContent.appendChild(childWrapper)
    childWrapper.appendChild(childContent)
    childContent.appendChild(grandsonWrapper)
    grandsonWrapper.appendChild(grandsonContent)
  })

  afterEach(() => {
    NestedScroll.purgeAllNestedScrolls()
    jest.clearAllMocks()
  })

  it('should proxy properties to scroll instance', () => {
    const scroll = new BScroll(parentWrapper, {
      nestedScroll: true,
    })
    new NestedScroll(scroll)
    expect(scroll.proxy).toBeCalledWith([
      {
        key: 'purgeNestedScroll',
        sourceKey: 'plugins.nestedScroll.purgeNestedScroll',
      },
    ])
  })

  it('nestedScroll.gropuId should be string or number ', () => {
    const spyFn = jest.spyOn(console, 'error')
    const nestedScroll1 = new NestedScroll(
      new BScroll(parentWrapper, {
        nestedScroll: {
          groupId: {} as any,
        },
      })
    )

    expect(spyFn).toBeCalledWith(
      '[BScroll warn]: groupId must be string or number for NestedScroll plugin'
    )
  })

  it('should allocate default groupId when nestedScroll options is "true"', () => {
    const nestedScroll1 = new NestedScroll(
      new BScroll(parentWrapper, {
        nestedScroll: true,
      })
    )
    const nestedScroll2 = new NestedScroll(
      new BScroll(childWrapper, {
        nestedScroll: true,
      })
    )

    expect(nestedScroll1).toEqual(nestedScroll2)
    expect(NestedScroll.instancesMap[DEFAUL_GROUP_ID]).toBe(nestedScroll1)
  })

  it('should share same nestedScroll when groupId is equal', () => {
    const nestedScroll1 = new NestedScroll(
      new BScroll(parentWrapper, {
        nestedScroll: {
          groupId: 0,
        },
      })
    )
    const nestedScroll2 = new NestedScroll(
      new BScroll(childWrapper, {
        nestedScroll: {
          groupId: 0,
        },
      })
    )

    expect(nestedScroll1).toEqual(nestedScroll2)
  })

  it('should store BScroll instance', () => {
    const nestedScroll1 = new NestedScroll(new BScroll(parentWrapper, {}))
    const nestedScroll2 = new NestedScroll(new BScroll(childWrapper, {}))

    expect(nestedScroll1.store.length).toBe(2)
    expect(nestedScroll1).toBe(nestedScroll2)
  })

  it('should build BScrollGraph', () => {
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'BScrollGraph',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'BScrollGraph',
      },
    })
    // ns1 === ns2
    const ns1 = new NestedScroll(parentScroll)
    const ns2 = new NestedScroll(childScroll)
    const parentBScrollFamily = ns1.store[0]
    const childBScrollFamily = ns1.store[1]

    expect(parentBScrollFamily.ancestors.length).toBe(0)
    expect(
      parentBScrollFamily.descendants.findIndex(([bf]) => {
        return bf === childBScrollFamily
      }) > -1
    ).toBe(true)
    expect(
      childBScrollFamily.ancestors.findIndex(([bf]) => {
        return bf === parentBScrollFamily
      }) > -1
    ).toBe(true)
    expect(childBScrollFamily.descendants.length).toBe(0)
  })

  it('should has different nestedScroll instance in NestedScroll class', () => {
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'BScrollGraph1',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'BScrollGraph2',
      },
    })

    const nestedScroll1 = new NestedScroll(parentScroll)
    const nestedScroll2 = new NestedScroll(childScroll)

    expect(nestedScroll1).not.toBe(nestedScroll2)
    expect(NestedScroll.getAllNestedScrolls().length).toBe(2)
  })

  it('disable the ancestors scroll when self is scrolling', () => {
    // vertical
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'vertical',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'vertical',
      },
    })
    const grandsonScroll = new BScroll(grandsonWrapper, {
      nestedScroll: {
        groupId: 'vertical',
      },
    })
    new NestedScroll(parentScroll)
    new NestedScroll(childScroll)
    new NestedScroll(grandsonScroll)

    addProperties(parentScroll, {
      pending: true,
    })
    addProperties(childScroll, {
      pending: true,
    })
    grandsonScroll.trigger(grandsonScroll.eventTypes.beforeScrollStart)

    expect(parentScroll.stop).toBeCalled()
    expect(parentScroll.resetPosition).toBeCalled()
    expect(childScroll.stop).toBeCalled()
    expect(childScroll.resetPosition).toBeCalled()

    // horizontal
    const parentScrollH = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'horizontal',
      },
      scrollY: false,
      scrollX: true,
    })
    const childScrollH = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'horizontal',
      },
      scrollY: false,
      scrollX: true,
    })
    const grandsonScrollH = new BScroll(grandsonWrapper, {
      nestedScroll: {
        groupId: 'horizontal',
      },
      scrollY: false,
      scrollX: true,
    })
    new NestedScroll(parentScrollH)
    new NestedScroll(childScrollH)
    new NestedScroll(grandsonScrollH)

    addProperties(parentScrollH, {
      hasVerticalScroll: false,
      hasHorizontalScroll: true,
    })
    addProperties(childScrollH, {
      hasVerticalScroll: false,
      hasHorizontalScroll: true,
    })
    addProperties(grandsonScrollH, {
      hasVerticalScroll: false,
      hasHorizontalScroll: true,
    })
    grandsonScrollH.trigger(grandsonScrollH.eventTypes.beforeScrollStart)

    expect(parentScrollH.disable).toBeCalled()
    expect(parentScrollH.scroller.actions.startTime).toBeTruthy()
    expect(childScrollH.disable).toBeCalled()
    expect(childScrollH.scroller.actions.startTime).toBeTruthy()
  })

  it('should delete scroll from nestedScroll graph when scroll is destroyed', () => {
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'deleteScroll',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'deleteScroll',
      },
    })

    const ns = new NestedScroll(parentScroll)
    new NestedScroll(childScroll)

    expect(ns.store.length).toBe(2)
    expect(childScroll.hooks.events.destroy.length).toBe(1)
    childScroll.hooks.trigger(childScroll.hooks.eventTypes.destroy)
    expect(ns.store.length).toBe(1)
    expect(childScroll.hooks.events.destroy.length).toBe(0)
  })

  it('should force ancestors and descendants stop when self will start scrolling', () => {
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'force-stop',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'force-stop',
      },
    })

    new NestedScroll(parentScroll)
    new NestedScroll(childScroll)

    addProperties(childScroll, {
      pending: true,
    })

    parentScroll.trigger(parentScroll.eventTypes.beforeScrollStart)
    expect(childScroll.stop).toBeCalled()
    expect(childScroll.resetPosition).toBeCalled()
  })

  it('should force self resetting potisition', () => {
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'force-stop',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'force-stop',
      },
    })

    addProperties(parentScroll, {
      hasVerticalScroll: false,
      hasHorizontalScroll: true,
    })
    addProperties(childScroll, {
      hasVerticalScroll: false,
      hasHorizontalScroll: true,
      x: 1,
    })

    new NestedScroll(parentScroll)
    new NestedScroll(childScroll)

    childScroll.trigger(childScroll.eventTypes.beforeScrollStart)
    expect(childScroll.scroller.reflow).toBeCalled()
    expect(childScroll.resetPosition).toBeCalled()
  })

  it('detectMovingDirection hook', () => {
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'enable-others',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'enable-others',
      },
    })

    new NestedScroll(parentScroll)
    new NestedScroll(childScroll)

    // one is moved, all ancestors should be disabled
    childScroll.scroller.actions.contentMoved = true
    const selfActionsHooks = childScroll.scroller.actions.hooks
    selfActionsHooks.trigger(selfActionsHooks.eventTypes.detectMovingDirection)
    expect(parentScroll.disable).toBeCalled()
  })

  it('should enable ancestors and descendants when self touchended', () => {
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'touchend',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'touchend',
      },
    })

    new NestedScroll(parentScroll)
    new NestedScroll(childScroll)

    childScroll.trigger(childScroll.eventTypes.touchEnd)
    expect(parentScroll.enable).toBeCalled()
    parentScroll.trigger(parentScroll.eventTypes.touchEnd)
    expect(childScroll.enable).toBeCalled()
  })

  it('should only allow top-scroll has bounce effect', () => {
    // vertical
    const parentScroll = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'vertical-bounce-effect',
      },
    })
    const childScroll = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'vertical-bounce-effect',
      },
    })

    new NestedScroll(parentScroll)
    new NestedScroll(childScroll)

    childScroll.movingDirectionY = -1

    const selfActionsHooks = childScroll.scroller.actions.hooks
    selfActionsHooks.trigger(selfActionsHooks.eventTypes.detectMovingDirection)

    expect(childScroll.disable).toBeCalled()
    expect(parentScroll.enable).toBeCalled()

    // horizontal

    const parentScrollH = new BScroll(parentWrapper, {
      nestedScroll: {
        groupId: 'horizontal-bounce-effect',
      },
    })
    const childScrollH = new BScroll(childWrapper, {
      nestedScroll: {
        groupId: 'horizontal-bounce-effect',
      },
    })

    addProperties(childScrollH, {
      hasVerticalScroll: false,
      hasHorizontalScroll: true,
    })

    new NestedScroll(parentScrollH)
    new NestedScroll(childScrollH)

    childScrollH.movingDirectionX = -1

    const selfActionsHooksH = childScrollH.scroller.actions.hooks
    selfActionsHooksH.trigger(
      selfActionsHooksH.eventTypes.detectMovingDirection
    )

    expect(childScrollH.disable).toBeCalled()
    expect(parentScrollH.enable).toBeCalled()
  })
})
