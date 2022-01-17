const PENDDING = 'pendding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

var isFunction = (val) => typeof (val) === 'function'


class MyPromise {
    constructor(handler) {

        if (!isFunction(handler)) { // 忘记了
            throw new Error('MyPromise must accept a function as a parameter')
        }

        this._status = PENDDING
        this._value = undefined

        this._fulfilledQueues = []
        this._rejectedQueues = []

        try {
            handler(this._resolve.bind(this), this._reject.bind(this))
        } catch (error) {
            _reject(error)
        }
    }

    // _resolve(val) {
    //     if (this._status !== 'PENDING') return // 忘记了
    //     this._status = FULFILLED
    //     this._value = val

    // }

    // _reject(err) {
    //     if (this._status !== 'PENDING') return // 忘记了
    //     this._status = REJECTED
    //     this._value = err
    // }

    // 再次改造
    _resolve(val) {
        // if (this._status !== 'PENDING') return // 放在这里
        // const run = () => {
        //     // if (this._status !== 'PENDING') return // 忘记了
        //     this._status = FULFILLED
        //     this._value = val

        //     let cb
        //     while (cb = this._fulfilledQueues.shift()) {
        //         cb()
        //     }
        // }

        // 再次改造，支持val是一个promise
        const run = () => {
            if (this._status !== 'PENDING') return
            const runFulfilled = (value) => {
                let cb
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            const runRejected = (value) => {
                let cb
                while (cb = this._rejectedQueues.shift()) {
                    cb(value)
                }
            }

            if (val instanceof MyPromise) {
                val.then(value => {
                    this._value = value
                    this._status = FULFILLED
                    runFulfilled(value)
                }, error => {
                    this._value = error
                    this._status = REJECTED
                    runRejected(error)
                })
            } else {
                this._value = val
                this._status = FULFILLED
            }
        }

        // 为了支持同步的Promise，这里采用异步调用
        setTimeout(() => {
            run()
        }, 0);
    }

    _reject(err) {
        if (this._status !== 'PENDING') return
        const run = () => {
            // if (this._status !== 'PENDING') return // 忘记了
            this._status = REJECTED
            this._value = err
            let cb
            while (cb = this._rejectedQueues.shift()) {
                cb()
            }
        }

        // 为了支持同步的Promise，这里采用异步调用
        setTimeout(() => {
            run()
        }, 0);
    }

    then(onFulfilled, onRejected) {
        const { _status, _value } = this

        // switch (_status) { // 转移到其他位置
        //     case PENDDING:
        //         this._fulfilledQueues.push(onFulfilled)
        //         this._rejectedQueues.push(onRejected)
        //         break;

        //     case FULFILLED:
        //         onFulfilled(_value)
        //         break;
        //     case REJECTED:
        //         onRejected(_value)
        //         break;

        //     default:
        //         break;
        // }

        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            // onFulfilledNext, onRejectedNext 就是取改变绑定的this里面的_status,_value,以及是否执行数组里的回调函数

            // 封装一个成功的回调函数
            let fulfilled = (value) => {
                try { // 得套入try catch中
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value)
                        // onFulfilledNext(_value) // 用的是传进来的value
                    }
                    let res = onFulfilled(value)
                    if (res instanceof MyPromise) {
                        res.then(onFulfilledNext, onRejectedNext)
                    } else {
                        onFulfilledNext(res) // 用的是res
                        // onFulfilledNext(_value)
                    }
                } catch (error) {
                    onRejectedNext(error)
                }


            }

            // 封装一个失败的回调函数
            let rejected = (error) => {

                try {
                    if (!isFunction(onRejected)) {
                        onRejectedNext(error)
                    } else {
                        let res = onRejected(error)
                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onRejectedNext(res)
                        }
                    }
                } catch (error) {
                    onRejectedNext(error)
                }

            }


            switch (_status) { // 转移到其他位置
                case PENDDING:
                    this._fulfilledQueues.push(fulfilled)
                    this._rejectedQueues.push(rejected)
                    break;

                case FULFILLED:
                    fulfilled(_value)
                    break;
                case REJECTED:
                    rejected(_value)
                    break;

                default:
                    break;
            }

        })
    }
}
// 默认.then()返回的是成功的回调，除非明确return一个失败的primise
// new Promise((res, rej) => { rej() }).then(() => { }, () => { console.log('失败了') }).then(() => { console.log('第二个成功了') }, () => { console.log('第二个失败了了')})