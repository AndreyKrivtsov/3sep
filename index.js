import WebSocket from 'ws'

const ws = new WebSocket('wss://3september.ru:8000', {
    origin: 'https://3september.ru'
})

let count = 0
const batch = 70000
const batchTime = 3000
let started = false

ws.on('open', function open () {
    started = true
    turnover()
    setInterval(() => {
        console.log('Переворачиваний: %s. Статус соед.: %s', count, ws.readyState)
    }, 1000)
})

ws.on('message', function incoming (message) {
    // totalCount = message
    // setTimeout(() => {
    //     ws.send('receive')
    // }, 1000)
})

function turnover() {
    if (started) {
        count += turnoverBatch()
        setTimeout(() => {
            turnover()
        }, batchTime)
    }
}

function turnoverBatch() {
    let i = 0
    while (i < batch) {
        ws.send('update')
        i++
    }
    return i
}