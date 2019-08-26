import DataManager from '../DataManager'

describe('DataManager unit test', () => {
  const NEW_LEN = 10
  let list: Array<any>
  let dataManager: DataManager

  let fetchFn = jest.fn()
  let onFetchFinish = jest.fn().mockReturnValue(0)

  beforeEach(() => {
    list = []

    dataManager = new DataManager(list, fetchFn, onFetchFinish)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch new data when loadedNum < list.length', () => {
    // given
    let end = NEW_LEN
    const DATA = 1
    const newData = new Array(NEW_LEN).fill(DATA)
    fetchFn.mockReturnValue(Promise.resolve(newData))
    // when
    // tslint:disable-next-line: no-floating-promises
    dataManager.update(end)
    // then
    // create empty data firstly, and then, go to fetch data
    expect(dataManager.getList().length).not.toBeLessThan(NEW_LEN)
    expect(fetchFn).toBeCalledWith(NEW_LEN)
  })

  it('should call onFetchFinish with hasMore equal true when loaded new data', async () => {
    // given
    const start = 0
    const end = NEW_LEN
    const DATA = 1
    const newData = new Array(NEW_LEN).fill(DATA)
    fetchFn.mockReturnValue(Promise.resolve(newData))
    // when
    await dataManager.update(end)
    // then
    expect(onFetchFinish).toBeCalledWith(dataManager.getList(), true)
  })

  it('should call onFetchFinish with hasMore equal false when no more data', async () => {
    // given
    const start = 0
    const end = NEW_LEN
    fetchFn.mockReturnValue(Promise.resolve(false))
    // when
    await dataManager.update(end)
    // then
    expect(onFetchFinish).toBeCalledWith(dataManager.getList(), false)
  })
})
