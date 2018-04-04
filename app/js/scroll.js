const indicatorDown = document.querySelector('.scroll-indicator.down')
const indicatorUp = document.querySelector('.scroll-indicator.up')
const indicatorDownProgress = document.querySelector('.scroll-indicator.down .progress')
const indicatorUpProgress = document.querySelector('.scroll-indicator.up .progress')
let directionIsDown = true
let progress = 0
let decayInterval = null
let decayTimeout = null

let listener = null

const PAGES = [
    'home',
    'about',
    'projects',
    'contact'
]

const updateUI = (val) => {
    if (directionIsDown) {
        indicatorUpProgress.style.height = '0px'
        indicatorDownProgress.style.height = val / 2 + 'px'
        indicatorDown.style.opacity = 1
    } else {
        indicatorDownProgress.style.height = '0px'
        indicatorUpProgress.style.height = val / 2 + 'px'
        indicatorUp.style.opacity = 1
    }
    if (val === 0) {
        indicatorDown.style.opacity = 0
        indicatorUp.style.opacity = 0
    }
}

const decay = () => {
    if (progress >= 4) {
        progress *= 0.75
    } else {
        progress--
    }
    if (progress <= 0) {
        progress = 0
        killDecayInterval(decayInterval)
    }
    updateUI(progress)
}

const killDecayInterval = () => {
    clearInterval(decayInterval)
    decayInterval = null
}

const killDecayTimeout = () => {
    clearTimeout(decayTimeout)
    decayTimeout = null
}

const scrollListener = (target, pageUp, pageDown) => {
    return event => {
        let atBottom = (target.scrollHeight - target.scrollTop) <= window.innerHeight
        let atTop = target.scrollTop <= 0
        killDecayInterval(decayInterval)
        killDecayTimeout(decayTimeout)
        if (atBottom && event.deltaY > 0 && pageDown !== undefined) {
            if (!directionIsDown) {
                directionIsDown = true
                progress = 0
            }
            progress += event.deltaY / 10
            if (progress >= 100) {
                target.removeEventListener('mousewheel', listener)
                window.goto(pageDown)
                progress = 0
            }
            updateUI(progress)
        } else if (atTop && event.deltaY < 0 && pageUp !== undefined) {
            if (directionIsDown) {
                directionIsDown = false
                progress = 0
            }
            progress -= event.deltaY / 10
            if (progress >= 100) {
                target.removeEventListener('mousewheel', listener)
                window.goto(pageUp)
                progress = 0
            }
            updateUI(progress)
        } else {
            progress = 0
            updateUI(progress)
        }
        decayTimeout = setTimeout(() => {
            if (progress > 0 && decayInterval === null) {
                decayInterval = setInterval(decay, 1000 / 60)
            }
        }, 1000);
    }
}

export default (target) => {
    let index = target.getAttribute('data-index') - 1
    progress = 0
    updateUI(progress)
    listener = scrollListener(target, PAGES[index - 1], PAGES[index + 1])
    target.addEventListener('mousewheel', listener, { passive: true })
}