class MyPromise {
    // 原型上then,catch,finally  静态方法 resolve,reject,all,race
    constructor(handle) {
        if (typeof handle != 'function') throw Error('必须是函数')
        this._status = 'pending'
        this._value = undefined
        this._fulfilledQueues = []
        this._rejectedQueues = []
        try {
            handle(this._resolve.bind(this), this._reject.bind(this))
        } catch (error) {
            this._reject(error)
        }
    }
    _resolve(value) { // 最好是val ,不然好多个value
        const run = () => {

            if (this._status !== 'pending') return // 忘记写了
            let resolve = (value) => {
                let cb
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            let reject = (err) => {
                let cb
                while (cb = this._rejectedQueues.shift()) {
                    cb(err)
                }
            }
            if (value instanceof MyPromise) {
                value.then(value => {
                    this._status = 'fulfilled'
                    this._value = value
                    resolve(value)
                }, err => {
                    this._status = 'fulfilled'
                    this._value = err
                    reject(err)
                })
            } else {
                this._status = 'fulfilled'
                this._value = value
                resolve(value)
            }

        }
        setTimeout(run, 0)
    }
    _reject() {
        let { _status, _value } = this
        if (this._status != 'fulfilled') return
        const runReject = () => {
            this._status = 'rejected'
            this._value = value
            let cb
            while (cb = this._fulfilledQueues.shift()) {
                cb(value)
            }
        }
        setTimeout(runReject, 0)
    }

    then(onFulfilled, onRejected) {
        let { _status, _value } = this
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            let fulfilled = (value) => {
                try {
                    if (typeof onFulfilled != 'function') {
                        onFulfilledNext(value)
                    } else {
                        let res = onFulfilled(value)
                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onFulfilledNext(res)
                        }
                    }
                } catch (error) {
                    onRejectedNext(error)
                }
            }

            let rejected = () => {
                try {
                    if (typeof onRejected != 'function') {
                        onRejectedNext(value)
                    } else {
                        let res = onRejected(value)
                        if (res instanceof MyPromise) {
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            onFulfilledNext(res) // 调用成功的，因为他走到当前这个失败的回调，默认你已经处理了失败的问题(就像生产：下一个流水线的人默认上一个流水线处理成功)，接下来应该成功，除非onRejected显式return Promise.reject()
                        }
                    }
                } catch (error) {
                    onRejectedNext(error)
                }
            }

            switch (_status) {
                case 'pending':
                    this._fulfilledQueues.push(fulfilled)
                    this._rejectedQueues.push(rejected)
                    break;
                case 'fulfilled':
                    fulfilled(_value)
                    break;
                case 'rejected':
                    rejected(_value)
                    break;
            }
        })
    }
    catch(onRejected) {
        return this.then(undefined, onRejected)
    }
    finally(cb) {
        // 注意箭头函数return的简写
        this.then(
            value => new MyPromise.resolve(cb()).then(() => value),
            reason => new MyPromise.resolve(cb()).then(() => { throw reason })
        )
    }

    // 都是return new MyPromise()
    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => { resolve(value) })
    }

    static reject(value) {
        return new MyPromise((resolve, reject) => { reject(value) })
    }
    static all(list) {
        return new MyPromise((resolve, reject) => {
            let values = []
            let count = 0
            for (let [i, p] of list.entries()) {
                this.resolve(p).then((val) => {
                    values[i] = val
                    count++
                    if (count == list.length) resolve(values)
                }, (err) => {
                    reject(err)
                })
            }
        })
    }
    static race(list) {
        return new MyPromise((resolve, reject) => {
            for (let [i, p] of list.entries()) {
                // 注意先调this.resolve(p)
                this.resolve(p).then((val) => {
                    resolve(val)
                }, (err) => {
                    reject(err)
                })
            }
        })
    }
}

new MyPromise((resolve, reject) => {
    setTimeout(resolve("haha"), 2000)
}).then((val) => {
    console.log(2)
    console.log(val)
})

// 手写Promise.all
Promise.all2 = function (list) {
    return new Promise((resolve, reject) => {
        let result = []
        let count = 0
        for (let [i, p] of list.entries()) {
            Promise.resolve(p).then((value) => {
                result[i] = value
                count++
                if (count == list.length) resolve(result)
            }, (reason) => {
                reject(reason)
            })
        }
    })
}
let list1 = [Promise.resolve(2), Promise.resolve(4), Promise.resolve('6')]
let list2 = [Promise.resolve(2), Promise.reject(4), Promise.resolve('6')]
Promise.all(list1).then((values) => { console.log(values) }, (values) => { console.log('2 -', values) });
Promise.all(list2).then((values) => { console.log(values) }, (values) => { console.log('2 -', values) });
console.log('---')
Promise.all2(list1).then((values) => { console.log(values) }, (values) => { console.log('2 -', values) })
Promise.all2(list2).then((values) => { console.log(values) }, (values) => { console.log('2 -', values) })




// https://juejin.cn/post/6844903665686282253
// 判断变量否为function
const isFunction = variable => typeof variable === 'function'
// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise2 {
    constructor(handle) {
        if (!isFunction(handle)) {
            throw new Error('MyPromise must accept a function as a parameter')
        }
        // 添加状态
        this._status = PENDING
        // 添加状态
        this._value = undefined
        // 添加成功回调函数队列
        this._fulfilledQueues = []
        // 添加失败回调函数队列
        this._rejectedQueues = []
        // 执行handle
        try {
            handle(this._resolve.bind(this), this._reject.bind(this))
        } catch (err) {
            this._reject(err)
        }
    }
    // 添加resovle时执行的函数
    _resolve(val) {
        const run = () => {
            if (this._status !== PENDING) return
            // 依次执行成功队列中的函数，并清空队列
            const runFulfilled = (value) => {
                let cb;
                while (cb = this._fulfilledQueues.shift()) {
                    cb(value)
                }
            }
            // 依次执行失败队列中的函数，并清空队列
            const runRejected = (error) => {
                let cb;
                while (cb = this._rejectedQueues.shift()) {
                    cb(error)
                }
            }
            /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
              当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
            */
            if (val instanceof MyPromise) {
                val.then(value => {
                    this._value = value
                    this._status = FULFILLED
                    runFulfilled(value)
                }, err => {
                    this._value = err
                    this._status = REJECTED
                    runRejected(err)
                })
            } else {
                this._value = val
                this._status = FULFILLED
                runFulfilled(val)
            }
        }
        // 为了支持同步的Promise，这里采用异步调用
        setTimeout(run, 0)
    }
    // 添加reject时执行的函数
    _reject(err) {
        if (this._status !== PENDING) return
        // 依次执行失败队列中的函数，并清空队列
        const run = () => {
            this._status = REJECTED
            this._value = err
            let cb;
            while (cb = this._rejectedQueues.shift()) {
                cb(err)
            }
        }
        // 为了支持同步的Promise，这里采用异步调用
        setTimeout(run, 0)
    }
    // 添加then方法
    then(onFulfilled, onRejected) {
        const { _value, _status } = this
        // 返回一个新的Promise对象
        return new MyPromise((onFulfilledNext, onRejectedNext) => {
            // 封装一个成功时执行的函数
            let fulfilled = value => {
                try {
                    if (!isFunction(onFulfilled)) {
                        onFulfilledNext(value)
                    } else {
                        let res = onFulfilled(value);
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res)
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err)
                }
            }
            // 封装一个失败时执行的函数
            let rejected = error => {
                try {
                    if (!isFunction(onRejected)) {
                        onRejectedNext(error)
                    } else {
                        let res = onRejected(error);
                        if (res instanceof MyPromise) {
                            // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                            res.then(onFulfilledNext, onRejectedNext)
                        } else {
                            //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                            onFulfilledNext(res)
                        }
                    }
                } catch (err) {
                    // 如果函数执行出错，新的Promise对象的状态为失败
                    onRejectedNext(err)
                }
            }
            switch (_status) {
                // 当状态为pending时，将then方法回调函数加入执行队列等待执行
                case PENDING:
                    this._fulfilledQueues.push(fulfilled)
                    this._rejectedQueues.push(rejected)
                    break
                // 当状态已经改变时，立即执行对应的回调函数
                case FULFILLED:
                    fulfilled(_value)
                    break
                case REJECTED:
                    rejected(_value)
                    break
            }
        })
    }
    // 添加catch方法
    catch(onRejected) {
        return this.then(undefined, onRejected)
    }
    // 添加静态resolve方法
    static resolve(value) {
        // 如果参数是MyPromise实例，直接返回这个实例
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }

    // 添加静态reject方法
    static reject(value) {
        return new MyPromise((resolve, reject) => reject(value))
    }
    // 添加静态all方法
    static all(list) {
        return new MyPromise((resolve, reject) => {
            /**
             * 返回值的集合
             */
            let values = []
            let count = 0
            for (let [i, p] of list.entries()) {
                // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
                this.resolve(p).then(res => {
                    values[i] = res
                    count++
                    // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
                    if (count === list.length) resolve(values)
                }, err => {
                    // 有一个被rejected时返回的MyPromise状态就变成rejected
                    reject(err)
                })
            }
        })
    }
    // 添加静态race方法
    static race(list) {
        return new MyPromise((resolve, reject) => {
            for (let p of list) {
                // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
                this.resolve(p).then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            }
        })
    }
    finally(cb) {
        // 无论成功还是失败都会执行finally,并且将值value,reason传递下去,调用finally是失败的，finally后的then也是失败的
        return this.then(
            value => MyPromise.resolve(cb()).then(() => value),
            reason => MyPromise.resolve(cb()).then(() => { throw reason })
        );
    }
}