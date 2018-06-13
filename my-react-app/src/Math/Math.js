import 'isomorphic-fetch'
import { notification } from 'antd'

function getTime() {
    var myDate = new Date()
    var mytime
    myDate.toLocaleDateString()
    myDate.getFullYear()
    myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    myDate.getDate();        //获取当前日(1-31)
    myDate.getDay();         //获取当前星期X(0-6,0代表星期天)
    myDate.getHours();       //获取当前小时数(0-23)
    myDate.getMinutes();     //获取当前分钟数(0-59)
    myDate.getSeconds();     //获取当前秒数(0-59)
    switch (myDate.getDay()) {
        case 0:
            mytime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}S${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            break;
        case 1:
            mytime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}M${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            break;
        case 2:
            mytime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}T${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            break;
        case 3:
            mytime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}W${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            break
        case 4:
            mytime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}T${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            break;
        case 5:
            mytime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}F${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            break;
        case 6:
            mytime = `${myDate.getFullYear()}-${myDate.getMonth() + 1}-${myDate.getDate()}S${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`
            break;
        default:
            mytime = null
    }
    return mytime
}

export { getTime }

/**
 * 
 * @param {链接} URL 
 * @param {内容} postBody 
 */
function postFetch(URL, postBody, Callback) {
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let request = new Request(URL, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(postBody),
        headers: myHeaders
    });
    fetch(request)
        .then(response => response.json())
        .then(result => {
            Callback(result)
        })
        .catch(res => {
            console.log(res)
        })
}

export { postFetch }

/**
 * 
 * @param {链接} URL 
 *
 */
function getFetch(URL, Callback){
    fetch(URL, {method:"GET"})
    .then((response)=> response.json())
    .then(data => {
        Callback(data)
    })
    .catch(error =>{
        console.log(error)
    })
}

export { getFetch }
/**
 * 
 * @param {链接} URL 
 */
function getTimeFetch(URL, Callback) {
    //超时对象  超过5000ms 返回reject
    let time = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('timeout')
        }, 30000);
    })
    //请求对象 resolve返回data reject返回error
    let fetchs = new Promise((resolve, reject) => {
        fetch(URL, { method: "GET" })
            .then((response) => {
                // console.log(response)
                if(response.status === 200){//成功
                    return response.json()
                }else{
                    return '获取数据失败'
                }
            })
            .then(data => {
                // console.log(data)
                resolve(data)
            })
            .catch(error => reject(error))
    })
    Promise.race([time, fetchs]).then((result) => {
        console.log(result)
        //5秒以后  返回timeout
        Callback(result)
    }).catch((error) => {
        // console.log(error)
        return error
    })
}

export {getTimeFetch}


/**
 * 
 * @param {检测PK} PK 
 * @param {回调} Callback 
 */
function Alert(PK, Callback) {
    if (PK === 0) {
        notification.open({
            message: '错误提示',
            description: '请选择一个节点',
        });
    } else {
        Callback()
    }

}

export { Alert }

function Errors(v) {
    notification.error({
        message: '错误提示',
        description: v + '为必填项'
    })
}

export { Errors }

function Time() {
    let time = new Date()
    let y = time.getFullYear()
    let m = time.getMonth() + 1
    m = m < 10 ? ('0' + m) : m
    let d = time.getDate()
    d = d < 10 ? ('0' + d) : d
    return y + '/' + m + '/' + d
}

export { Time }
