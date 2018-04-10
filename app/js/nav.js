import attachScroller from './scroll'

let currentPage = null

const removeClass = (el, cls) => {
    el.className = el.className.replace(cls, '').replace(' ' + cls, '')
}

const updateNav = page => {
    page = page ? page : 'home'
    const noAnim = document.body.className.indexOf('no-anim') > -1
    document.body.className = page + (noAnim ? ' no-anim' : '')
    if (currentPage && currentPage !== page) {
        const divOut = document.querySelector(`.content.${currentPage}`)
        const divIn = document.querySelector(`.content.${page}`)
        // unhide divIn
        removeClass(divIn, /\s*hidden\s*/)
        if (noAnim) {
            divOut.className += ' hidden'
            attachScroller(divIn)
            currentPage = page
            return
        }
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
            attachScroller(divIn)
        }, 990)
    }
    currentPage = page
}

updateNav()
attachScroller(document.querySelector('.content.home'))

window.onpopstate = (event) => {
    updateNav(event.path[0].location.pathname.replace(/\//g, ''))
}

export default updateNav