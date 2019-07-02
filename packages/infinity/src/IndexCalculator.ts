export const PRE_NUM = 10
export const POST_NUM = 30
const DEFAULT_HEIGHT = 37

enum DIRECTION {
  UP,
  DOWN
}

export default class IndexCalculator {
  private lastTopVisibleIndex = 0
  private lastTopVisibleOffset = 0
  private lastDirection = DIRECTION.DOWN

  constructor(public wrapperHeight: number) {}

  calculate(pos: number, list: Array<any>): { start: number; end: number } {
    // TODO offset 是否可以去掉？
    const lastPos = this.getLastPos(list) + this.lastTopVisibleOffset

    let offset = pos - lastPos

    const direction = this.getDirection(offset)

    offset += this.lastTopVisibleOffset

    let { index: start, offset: startOffset } = this.getStart(offset, list)
    this.lastTopVisibleIndex = start
    this.lastTopVisibleOffset = startOffset

    let { index: end } = this.getEnd(start, list)

    if (direction === DIRECTION.DOWN) {
      start -= PRE_NUM
      end += POST_NUM
    } else {
      start -= POST_NUM
      end += PRE_NUM
    }

    if (start < 0) {
      start = 0
    }

    return {
      start,
      end
    }
  }

  private getDirection(offset: number): DIRECTION {
    let direction
    if (offset > 0) {
      direction = DIRECTION.DOWN
    } else if (offset < 0) {
      direction = DIRECTION.UP
    } else {
      return this.lastDirection
    }
    this.lastDirection = direction
    return direction
  }

  private getLastPos(list: Array<any>): number {
    let pos = 0
    for (let i = 0; i < this.lastTopVisibleIndex; i++) {
      pos += (list[i] && list[i].height) || DEFAULT_HEIGHT
    }
    return pos
  }

  private getStart(
    offset: number,
    list: Array<any>
  ): { index: number; offset: number } {
    if (offset === 0) {
      return {
        index: this.lastTopVisibleIndex,
        offset: this.lastTopVisibleOffset
      }
    }
    return this.calculateIndex(this.lastTopVisibleIndex, offset, list)
  }

  private getEnd(
    start: number,
    list: Array<any>
  ): { index: number; offset: number } {
    return this.calculateIndex(start, this.wrapperHeight, list)
  }

  private calculateIndex(
    start: number,
    offset: number,
    list: Array<any>
  ): { index: number; offset: number } {
    if (start < 0) {
      return {
        index: 0,
        offset: 0
      }
    }

    let i = start
    let tombstones = 0

    if (offset < 0) {
      while (offset < 0 && i > 0 && list[i - 1].height) {
        offset += list[i - 1].height
        i--
      }
      tombstones = Math.max(-i, Math.ceil(Math.min(offset, 0) / DEFAULT_HEIGHT))
    } else if (offset > 0) {
      while (
        offset > 0 &&
        i < list.length &&
        list[i].height &&
        list[i].height <= offset
      ) {
        offset -= list[i].height
        i++
      }
      if (i >= list.length || !list[i].height) {
        tombstones = Math.floor(Math.max(offset, 0) / DEFAULT_HEIGHT)
      }
    }

    i += tombstones
    offset -= tombstones * DEFAULT_HEIGHT

    return {
      index: i,
      offset: offset
    }
  }
}
