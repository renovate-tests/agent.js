/* @flow */
import { describe, it, beforeEach, afterEach } from 'mocha'
import { spy as sinonSpy, useFakeTimers } from 'sinon'
import { random, internet } from 'faker'
import { throws } from 'assert-exception'
import assert from 'assert'

describe('core', () => {
  const Agent = require('../src/core').default
  const Base = require('../src/events').default
  const Raven = require('../src/constants').OPTIONS.Raven
  const mitt = require('mitt')

  let agent, emitter, timer
  beforeEach(() => {
    emitter = mitt()
    timer = useFakeTimers(new Date().getTime())

    class DummyEvents extends Base {
      validate () {
        return true
      }
      on () {
        super.on(document.body, 'click', () => {})
        emitter.on('test', data => {
          super.emit(data)
        })
      }
    }

    agent = new Agent(
      random.alphaNumeric(),
      [
        DummyEvents
      ],
      {
        baseUrl: internet.url(),
        cookieName: random.alphaNumeric(),
        cookieDomain: random.alphaNumeric(),
        cookieExpires: 0,
        Raven: Raven
      }
    )
  })

  afterEach(() => {
    timer.restore()
    agent.destroy()
  })

  it('instance', () => {
    assert(agent)
  })

  it('listen before send pageview', () => {
    assert(throws(() => { agent.listen() }).message === 'need send pageview')

    agent.loaded = true

    assert(throws(() => { agent.listen() }).message === 'need send pageview')
  })

  it('send', () => {
    const spy = sinonSpy(require('../src/requests'), 'get')
    agent.send('pageview', location.pathname)

    it('failed', () => {
      emitter.emit('test', {
        x: -1,
        y: -1
      })
      timer.tick(60 * 30 * 1000)

      assert(spy.called === false)
      spy.restore()
    })

    it('success', () => {
      const spy = sinonSpy(require('../src/requests'), 'get')
      agent.send('pageview', location.pathname)

      emitter.emit('test', {
        x: random.number({min: 1}),
        y: random.number({min: 1})
      })
      timer.tick(60 * 30 * 1000)

      const before = spy.callCount
      assert(before)

      timer.tick(60 * 1 * 1000)

      assert(spy.callCount === before, 'stop tracking')

      spy.restore()
    })
  })
})
