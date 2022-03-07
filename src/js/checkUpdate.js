const request = require('request-promise')
const cheerio = require('cheerio')
const package = require('../../package.json')

url = 'https://github.com/supersu-man/macronium-pc/releases/latest'


async function getLatestVersion(){
    try {
        const html = await request(url)
        const $ = cheerio.load(html)
        const temp = $('span.css-truncate-target').first()
        var version = temp.text().toString()
        if (version.includes('v')) {
            version = version.replace('v', '')
        }
        if (version == "") {
            return '404'
        }
        return version.trim()
    } catch (err) {
        return '404'
    } 
}

async function isNewUpdateFound(callback){
    var currentVersion = package.version.toString()
    var latestVersion = await getLatestVersion()
    console.log(currentVersion + '==' + latestVersion )
    if(latestVersion=='404'){
        callback(false)
    }
    else{
        callback(currentVersion != latestVersion)
    }
}

module.exports = {isNewUpdateFound}