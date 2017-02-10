/* @flow */
import EventBase from '../events'
import { validate } from '../browser'
import { SCROLL } from '../constants'
import type { Point } from '../types'

function getPotision (w: window): Point {
  return {x: w.scrollX + w.screenX, y: w.scrollY + (w.screenY / 2)}
}

export default class ScrollEvents extends EventBase {
  validate (): boolean {
    const enable = validate(SCROLL.concat(['screenY', 'screenX']))
    if (!enable) {
      this.logger.warning('disable scroll')
    }
    return enable
  }
  on () {
    super.on(window, 'scroll', () => {
      this.emit(getPotision(window))
    })
  }
}
