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
    if (path !== window.location.pathname.replace(/\//g, '')) {
        updateNav(page)
        regeneratePoly()
        window.history.pushState(page, page, '/' + page)
    }
    return false
}