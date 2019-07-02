import { style, cssVendor } from '@better-scroll/shared-utils'

export default class Tombstone {
  public cached: Array<HTMLElement> = []
  public width = 0
  public height = 0

  private initialed = false
  private timers: Array<number> = []

  constructor(private create: () => HTMLElement) {
    this.getSize()
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
      tombstone.style.display = ''
      tombstone.style.opacity = '1'
      ;(<any>tombstone.style)[style.transform] = ''
      ;(<any>tombstone.style)[style.transition] = ''
      return tombstone
    }
    return this.create()
  }

  isTombstone(el: HTMLElement): boolean {
    if (el && el.classList) {
      return el.classList.contains('tombstone')
    }
    return false
  }

  waitForRecycle(tombstones: Array<HTMLElement>, delay = 200): void {
    const timerId = window.setTimeout(() => {
      for (let tombstone of tombstones) {
        tombstone.style.display = 'none'
        // Tombstone can be recycled now.
        this.cached.push(tombstone)
      }
    }, delay)

    this.timers.push(timerId)
  }
}
