import DataManager from '../DataManager'
import DomManager from '../DomManager'

jest.mock('../DomManager')

describe('DataManager unit test', () => {
  const NEW_LEN = 10
  let list: Array<any>
  let dataManager: DataManager
  let domManager: DomManager

  let fetchFn = jest.fn()
  let renderFn = jest.fn()
  let content = document.createElement('div')

  beforeEach(() => {
    list = []
    domManager = new DomManager(content, renderFn)
    ;(<jest.Mock>domManager.update).mockReturnValue({})
    dataManager = new DataManager(list, fetchFn, domManager)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should add new list element when endIndex < list.length', () => {
    // given
    let start = 0
    let end = NEW_LEN
    // when
    // tslint:disable-next-line: no-floating-promises
    dataManager.update(start, end)
    // then
    expect(dataManager.list.length).not.toBeLessThan(NEW_LEN)
    expect(domManager.update).toBeCalled()
  })

  it('should load new data when endIndex < list.length', async () => {
    // given
    const start = 0
    const end = NEW_LEN
    const DATA = 1
    const newData = new Array(NEW_LEN).fill(DATA)
    fetchFn.mockReturnValue(Promise.resolve(newData))
    // when
    await dataManager.update(start, end)
    // then
    expect(fetchFn).toBeCalled()
    expect(dataManager.loadedNum).not.toBeLessThan(NEW_LEN)
    expect(domManager.update).toBeCalledTimes(2)
  })
})
