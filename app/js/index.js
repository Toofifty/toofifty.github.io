import goTo from './page'
import regeneratePoly from './poly'
import './scroll'

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

document.querySelectorAll('.content.home .site-title span')[0].textContent = greeting