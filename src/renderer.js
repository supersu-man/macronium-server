const canvas = document.getElementById('imgContainer')
window.api.getqr().then((qr) => {
    canvas.src = qr
})

const versionTextElement = document.getElementById('versionText')
window.api.getVersion().then((version) => {
    versionTextElement.innerHTML = 'v' + version
})

const statusTextElement = document.getElementById("statusText")
window.api.status((event, bool) => {
    if (bool) {
        statusTextElement.innerHTML = 'Connected'
        document.getElementById('imgContainer').setAttribute('hidden', 'true')
    }
    else {
        statusTextElement.innerHTML = 'Disconnected'
        document.getElementById('imgContainer').removeAttribute('hidden')
    }
})

const repoButton = document.getElementById('repoButton')
repoButton.onclick = () => {
    window.api.open('https://supersu-man.github.io/macronium/')
}

const toggle = document.getElementById('themeSwitch')
const bool = window.api.getTheme().then((bool) => {
    if (bool) {
        document.body.classList.replace('light-theme', 'dark-theme')
        toggle.setAttribute('checked', 'true')
    }
})

toggle.addEventListener('change', () => {
    if (toggle.checked) document.body.classList.replace('light-theme', 'dark-theme')
    else document.body.classList.replace('dark-theme', 'light-theme')
    window.api.saveTheme(toggle.checked)
})