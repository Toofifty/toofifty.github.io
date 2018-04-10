import goTo from './page'
import regeneratePoly from './poly'
import './scroll'

if (navigator.userAgent.indexOf('Safari/') > -1 && navigator.userAgent.indexOf('Chrome/') === -1) {
    document.body.className = 'no-anim'
}

goTo(window.location.pathname.replace(/\//g, ''), true)
window.goto = goTo

const greetings = [
    'Hi.',
    'G’day.',
    'Hey.',
    'Hi!',
    'Hi,',
    'Hi,',
    'Hola!',
    'Hallo,',
    'Ahoyhoy,',
    'Ahoy,',
]
const greeting = greetings[parseInt(Math.random() * greetings.length)]

document.querySelector('.content.home .site-title span').textContent = greeting