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
        console.log(divOut, divIn)
        // unhide divIn
        removeClass(divIn, 'hidden')
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
                removeClass(divOut, 'going-down')
                removeClass(divIn, 'coming-down')
            } else {
                removeClass(divOut, 'going-up')
                removeClass(divIn, 'coming-up')
            }
            divOut.className += ' hidden'
        }, 990)
    }
    currentPage = page
}

updateNav()

export default updateNav