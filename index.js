import WebSocket from 'ws'

let count = 0
const batch = 70000
const batchTime = 3000
let started = false

let ws = null
let reconnectInterval = 1 * 1000 * 60;
let openedSocket = false

const connect = () => {
    ws = new WebSocket('wss://3september.ru:8000', {
        origin: 'https://3september.ru'
    })

    ws.on('open', function open () {
        console.log('Connected')
        openedSocket = true
        started = true
        turnover()
        setInterval(() => {
            console.log('Переворачиваний: %s. Статус соед.: %s', count, ws.readyState)
            if (ws.readyState !== 1) {
                console.log('Рестарт. Статус соед.: %s', count, ws.readyState)
                started = false
                openedSocket = false
            }
        }, 1000)
    })

    ws.on('message', function incoming (message) {
        // totalCount = message
        // setTimeout(() => {
        //     ws.send('receive')
        // }, 1000)
    })

    ws.on("error", (err) => {
        console.log("WEBSOCKET_ERROR: Error", err.message);
        openedSocket = false;
    });

    ws.on('close', function() {
        console.log('Disconnected');
        openedSocket = false
        setTimeout(connect, reconnectInterval);
    });
}

connect()

setInterval(() => {
    if (!openedSocket) {
        connect();
    }
}, 5000);

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