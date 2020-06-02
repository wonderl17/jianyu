import axios from 'axios'
import Pubsub from 'pubsub-js'
// axios.defaults.withCredentials = true
// axios.defaults.crossDomain = true
axios.defaults.withCredentials = true   // 让ajax携带cookie
let warnOtherLogin = (function () {
    let hasWarn = false
    return function (type) {
        console.log('触发pub登录状态')
        if (!hasWarn) {
            hasWarn = true
            Pubsub.publish('pubApp', {type})
        }
    }
})()
export default function ajax (url = '', data = {}, method = 'GET') {
    return new Promise(function (resolve, reject) {
        let promise
        if (method === 'GET') {
            // name=tom&pwd=123
            let dataString = ''
            Object.keys(data).forEach(key => {
                const value = data[key]
                dataString += key + '=' + value + '&'
            })
            if (dataString) {
                dataString = dataString.substring(0, dataString.length - 1) // 去掉最后的&
                // /login?name=tom&pwd=123
                url += '?' + dataString
            }
            promise = axios.get(url)
        } else if (method === 'POST') {
            promise = axios.post(url, data) // {name:'tom', pwd: '123'}
        } else if (method === 'PUT') {
            promise = axios.put(url, data) // {name:'tom', pwd: '123'}
        } else if (method === 'DELETE') {
            promise = axios.delete(url, {data: data})
        } else if (method === 'PATH') {
            Object.keys(data).forEach(key => {
                url += '/' + data[key]
            })
            promise = axios.get(url)
        }
        promise.then(response => {
            resolve(response.data)
        }).catch((error) => {
            console.log(error.response)
            if (error.response && error.response.data.status === "-11009") {
                warnOtherLogin('otherLogin')
            }
            if (error.response && error.response.data.status === "-11008") {
                warnOtherLogin('loginTimeout')
            }
            if (error.response && error.response.data.status === "401" && error.response.data.info === 'UNAUTHORIZED') {
                warnOtherLogin('loginToView')
            }
            error.response && resolve(error.response.data)
        })
    })
}