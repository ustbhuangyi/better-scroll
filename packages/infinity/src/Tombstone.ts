import { style } from '@better-scroll/shared-utils'

export default class Tombstone {
  private cached: Array<HTMLElement> = []
  public width = 0
  public height = 0

  private initialed = false

  constructor(private create: () => HTMLElement) {
    this.getSize()
  }

  static isTombstone(el: HTMLElement): boolean {
    if (el && el.classList) {
      return el.classList.contains('tombstone')
    }
    return false
  }

  private getSize(): void {
    if (!this.initialed) {
      let tombstone = this.create()
      tombstone.style.position = 'absolute'
      document.body.appendChild(tombstone)

      tombstone.style.display = ''
      this.height = tombstone.offsetHeight
      this.width = tombstone.offsetWidth

      document.body.removeChild(tombstone)

      this.cached.push(tombstone)
    }
  }

  getOne(): HTMLElement {
    let tombstone = this.cached.pop()
    if (tombstone) {
      const tombstoneStyle = tombstone.style as any

      tombstoneStyle.display = ''
      tombstoneStyle.opacity = '1'
      tombstoneStyle[style.transform] = ''
      tombstoneStyle[style.transition] = ''
      return tombstone
    }
    return this.create()
  }

  recycle(tombstones: Array<HTMLElement>): Array<HTMLElement> {
    for (let tombstone of tombstones) {
      tombstone.style.display = 'none'
      this.cached.push(tombstone)
    }
    return this.cached
  }

  recycleOne(tombstone: HTMLElement) {
    this.cached.push(tombstone)

    return this.cached
  }
}
