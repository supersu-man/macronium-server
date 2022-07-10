const toggle = document.getElementById('themeSwitch')
const body = document.getElementById('body')
const canvas = document.getElementById('img-container')
const repoButton = document.getElementById('repoButton')
const updateButton = document.getElementById('updateButton')
const versionTextElement = document.getElementById('version-text')
const statusTextElement = document.getElementById("status_text")

window.connection.setStatusListener(statusTextElement)
window.version.setVersionText(versionTextElement)

if (window.store.isDarkModeEnabled()) {
    body.classList.remove('light-theme')
    body.classList.add('dark-theme')
    toggle.setAttribute('checked', 'true')
}

var tint = getComputedStyle(body).getPropertyValue('--on-surface')
window.qr.setQR(canvas, tint)

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        body.classList.remove('light-theme')
        body.classList.add('dark-theme')
        window.store.enableDarkMode()
    } else {
        body.classList.add('light-theme')
        body.classList.remove('dark-theme')
        window.store.disableDarkMode()
    }
    tint = getComputedStyle(body).getPropertyValue('--on-surface')
    window.qr.setQR(canvas, tint)
})

repoButton.addEventListener('click', () => {
    window.shell.openExternal('https://supersu-man.github.io/macronium/')
})

updateButton.addEventListener('click', () => {
    window.shell.openExternal('https://github.com/supersu-man/macronium-server/releases')
})