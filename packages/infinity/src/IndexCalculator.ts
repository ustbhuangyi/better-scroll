export const PRE_NUM = 10
export const POST_NUM = 30

const enum DIRECTION {
  UP,
  DOWN,
}

export default class IndexCalculator {
  private lastDirection = DIRECTION.DOWN
  private lastPos = 0

  constructor(public wrapperHeight: number, private tombstoneHeight: number) {}

  calculate(pos: number, list: Array<any>): { start: number; end: number } {
    let offset = pos - this.lastPos
    this.lastPos = pos

    const direction = this.getDirection(offset)

    // important! start index is much more important than end index.
    let start = this.calculateIndex(0, pos, list)

    let end = this.calculateIndex(start, pos + this.wrapperHeight, list)

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
      end,
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

  private calculateIndex(
    start: number,
    offset: number,
    list: Array<any>
  ): number {
    if (offset <= 0) {
      return start
    }

    let i = start
    let startPos = list[i] && list[i].pos !== -1 ? list[i].pos : 0
    let lastPos = startPos
    let tombstone = 0
    while (i < list.length && list[i].pos < offset) {
      lastPos = list[i].pos
      i++
    }

    if (i === list.length) {
      tombstone = Math.floor((offset - lastPos) / this.tombstoneHeight)
    }

    i += tombstone

    return i
  }

  resetState() {
    this.lastDirection = DIRECTION.DOWN
    this.lastPos = 0
  }
}
