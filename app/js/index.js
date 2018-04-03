import goTo from './page'

goTo(window.location.pathname.replace(/\//g, ''), true)
window.goto = goTo