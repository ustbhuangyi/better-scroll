const PRE_NUM = 10
const POST_NUM = 30

enum DIRECTION {
  UP,
  DOWN
}

export default class IndexCalculator {
  private lastPos = 0
  private lastTopVisibleIndex = 0
  private lastTopVisibleOffset = 0
  private defaultHeight = 37

  constructor(public wrapperHeight: number) {}

  calculate(pos: number, list: Array<any>): { start: number; end: number } {
    let start = 0
    let end = 0
    pos = 0 - pos
    let offset = pos - this.lastPos + this.lastTopVisibleOffset
    this.lastPos = pos
    const direction = offset >= 0 ? DIRECTION.DOWN : DIRECTION.UP
    if (pos !== 0) {
      // TODO start
      if (offset >= 0) {
        start = this.lastTopVisibleIndex
        while (
          start < list.length &&
          list[start].height &&
          offset >= list[start].height
        ) {
          offset -= list[start].height
          start++
        }
      }
    }

    this.lastTopVisibleIndex = start
    this.lastTopVisibleOffset = offset

    let height = this.wrapperHeight + offset
    let visibleCnt = 0
    if (!list[start]) {
      visibleCnt = Math.floor(height / this.defaultHeight)
    } else {
      while (
        start + visibleCnt < list.length &&
        list[start + visibleCnt].height &&
        height >= list[start + visibleCnt].height
      ) {
        height -= list[start].height
        visibleCnt++
      }
    }

    end = start + visibleCnt

    if (direction === DIRECTION.DOWN) {
      start -= PRE_NUM
      end = end + POST_NUM
    }

    if (start < 0) {
      start = 0
    }
    return {
      start,
      end
    }
  }
}
