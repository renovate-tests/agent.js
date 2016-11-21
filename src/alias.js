/* @flow */
function timestamp (): number {
  return Date.now()
}

function createElement (): Function {
  return document.createElement
}

const bodyAlias = (body => {
  function resourceHeight (): number {
    return body.clientHeight
  }
  function resourceWidth (): number {
    return body.clientWidth
  }
  return {
    resourceHeight,
    resourceWidth
  }
})(document.body)

const screenAlias = (s => {
  function screenHeight (): number {
    return s.height
  }
  function screenWidth (): number {
    return s.width
  }
  return {
    screenHeight,
    screenWidth
  }
})(screen)

const windowAlias = (w => {
  function windowHeight (): number {
    return w.innerHeight
  }
  function windowWidth (): number {
    return w.innerWidth
  }
  return {
    windowHeight,
    windowWidth
  }
})(window)

module.exports = Object.assign({},
  {
    createElement,
    timestamp
  },
  bodyAlias,
  screenAlias,
  windowAlias,
)
