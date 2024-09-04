function sleep(seconds) {
    return new Promise(r => setTimeout(r, seconds * 1000))
}

function openJSON() {

}

module.exports = {sleep};