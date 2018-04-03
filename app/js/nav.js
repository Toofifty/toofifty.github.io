let currentPage = null

const removeClass = (el, cls) => {
    el.className = el.className.replace(cls, '').replace(' ' + cls, '')
}

const updateNav = page => {
    page = page ? page : 'home'
    document.body.className = page
    if (currentPage && currentPage !== page) {
        const divOut = document.querySelectorAll(`.content.${currentPage}`)[0]
        const divIn = document.querySelectorAll(`.content.${page}`)[0]
        // unhide divIn
        removeClass(divIn, /\s*hidden\s*/)
        const goingDown = divOut.getAttribute('data-index') > divIn.getAttribute('data-index')
        if (goingDown) {
            // go down
            divOut.className += ' going-down'
            divIn.className += ' coming-down'
        } else {
            // go up
            divOut.className += ' going-up'
            divIn.className += ' coming-up'
        }
        setTimeout(() => {
            if (goingDown) {
                removeClass(divOut, /\s*going-down\s*/)
                removeClass(divIn, /\s*coming-down\s*/)
            } else {
                removeClass(divOut, /\s*going-up\s*/)
                removeClass(divIn, /\s*coming-up\s*/)
            }
            divOut.className += ' hidden'
        }, 990)
    }
    currentPage = page
}

updateNav()

window.onpopstate = (event) => {
    updateNav(event.path[0].location.pathname.replace(/\//g, ''))
}

export default updateNav