import polygen from './polygen.min.js'

document.getElementById('polygen').setAttribute('height', window.innerHeight)
document.getElementById('polygen').setAttribute('width', Math.max(1200, window.innerWidth))
const hue = Math.random() * 256
polygen(document.getElementById('polygen'), {
    hue,
    split: 6,
    padding: 1,
    colorgen: 'fade_down'
})
document.body.style.setProperty('--base-color', `hsl(${hue}, 75%, 75%)`)

export default () => {
    if (document.body.className.indexOf('no-anim') === -1) {
        const hue = Math.random() * 256
        polygen(document.getElementById('polygen'), {
            hue
        })
        document.body.style.setProperty('--base-color', `hsl(${hue}, 75%, 75%)`)
    }
}