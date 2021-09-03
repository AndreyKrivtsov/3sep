import fetch from 'node-fetch'
import { names, logins, mails } from './data.js'

let successCounter = 0
let failConter = 0
const url = 'http://cannabisterre.com/ynd42/mail.php'
const timeout = 200

async function run() {
    const name = getName()
    const mail = getMail()
    const phone = getPhone()
    const [ status, statusCode, time ] = await send(name, mail, phone)
    console.log('%s/%s. Ответ: %s. Статус: %s. Время: %s. %s, %s, %s', successCounter, failConter, status, statusCode, time, name, mail, phone)
    if (status) {
        successCounter++
    }
    else {
        failConter++
    }
    setTimeout(() => {
        run()
    }, statusCode ? timeout : 5000)
}

async function send(name, mail, phone) {
    let time = Date.now()
    const data = getData(name, mail, phone)
    const body = compileBody(data)

    try {
        const response = await fetch(url, { method: 'POST', body: body })
        const responseStatus = response.status
        const text = await response.text()
        const search = text.includes('/thank-you.php')
        time = Date.now() - time
        return [search, responseStatus, time]
    }
    catch (e) {
        console.log(e)
        return [false, 0, 0]
    }

}

function getData(name, email, phone) {
    const counties = [
        'RU',
        'UA',
        'KZ',
        'BY',
    ]
    const country = counties[Math.floor(Math.random()*counties.length)]
    const data = {
        name: name,
        email: email,
        phone: phone,
        c1: 'on',
        c2: 'on',
        country: country,
        lang: country,
        pixel: '',
        gclid: '',
        gpixel: '',
        ttpixel: '',
        preland_url: 'cannabisterre.com',
        sid: 'self_2r',
        landing_url: 'http://cannabisterre.com/ynd42/'
    }
    return data
}

function compileBody(data) {
    const body = new URLSearchParams()
    for (const key in data) {
        body.append(key, data[key])
    }
    return body
}

function getName() {
    return names[Math.floor(Math.random()*names.length)];
}

function getMail() {
    const login = logins[Math.floor(Math.random()*logins.length)];
    const mail = mails[Math.floor(Math.random()*mails.length)];
    return `${login}@${mail}`
}

function getPhone() {
    const r = () => {
        return Math.floor(Math.random()*9)
    }
    return `+7 (9${r()}${r()}) ${r()}${r()}${r()}-${r()}${r()}-${r()}${r()}`
}

run()