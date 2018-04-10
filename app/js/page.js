import updateNav from './nav'
import regeneratePoly from './poly'

const VALID_PAGES = [
    '',
    'about',
    'projects',
    'contact'
]

export default (path, forceUpdate) => {
    let page = ''
    if (VALID_PAGES.indexOf(path) > -1) {
        page = path
    } else {
        window.history.replaceState(null, null, '/')
    }
    if (forceUpdate) {
        updateNav(page)
    }
    if (page === 'projects') {
        document.querySelectorAll('[data-srcset]').forEach(source => {
            source.setAttribute('srcset', source.getAttribute('data-srcset'))
            source.removeAttribute('data-src')
        })
        document.querySelectorAll('[data-src]').forEach(img => {
            img.setAttribute('src', img.getAttribute('data-src'))
            img.removeAttribute('data-src')
        })
    }
    if (path !== window.location.pathname.replace(/\//g, '')) {
        updateNav(page)
        regeneratePoly()
        window.history.pushState(page, page, '/' + page)
    }
    return false
}