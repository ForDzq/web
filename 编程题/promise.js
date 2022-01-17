// 判断变量否为function
const isFunction = variable => typeof variable === 'function'
// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
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
            console.log('正在执行成功的_resolve')
            if (this._status !== PENDING) return
            // 依次执行成功队列中的函数，并清空队列
            const runFulfilled = (value) => {
                console.log('_resolve执行队列中成功的回调')
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
        console.log('0秒后执行成功的_resolve')
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
        console.log('then里返回新的promise示例')
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
                    this._fulfilledQueues.push(fulfilled) // 返回的新promise此刻用的是箭头函数，所以this指向的是上一个promise,status也是上一个promise的状态
                    this._rejectedQueues.push(rejected)
                    console.log('pending---', this._fulfilledQueues.length, this._rejectedQueues.length)
                    break
                // 当状态已经改变时，立即执行对应的回调函数
                case FULFILLED:
                    console.log('fulfilled前---', this._fulfilledQueues.length, this._rejectedQueues.length)
                    fulfilled(_value)
                    console.log('fulfilled后---', this._fulfilledQueues.length, this._rejectedQueues.length)
                    break
                case REJECTED:
                    console.log('reject前---', this._fulfilledQueues.length, this._rejectedQueues.length)
                    rejected(_value)
                    console.log('reject后---', this._fulfilledQueues.length, this._rejectedQueues.length)
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
        return this.then(
            value => MyPromise.resolve(cb()).then(() => value),
            reason => MyPromise.resolve(cb()).then(() => { throw reason })
        );
    }
}


// new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res(1)
//     }, 2000);
// })
//     .then(() => { console.log(2) })
//     .then(() => { console.log(3) })
//     .then(() => { console.log(4) });

//                 pending-- - 1 1
// promise.js: 133 pending-- - 1 1
// promise.js: 133 pending-- - 1 1
// promise.js: 212 2
// promise.js: 213 3
// promise.js: 214 4

// new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res(1)
//     }, 2000);
// })
//     .then(() => {
//         console.log(2);
//         return new MyPromise((res, red) => {
//             setTimeout(() => {
//                 res('b')
//             }, 1000);
//         })
//     })
//     .then(() => { console.log(3) })
//     .then(() => { console.log(4) });

//                 pending-- - 1 1
// promise.js: 133 pending-- - 1 1
// promise.js: 133 pending-- - 1 1
// promise.js: 229 2
// promise.js: 133 pending-- - 1 1
// promise.js: 236 3
// promise.js: 237 4


// let p1 = new MyPromise((res, rej) => {
//     setTimeout(() => {
//         res(1)
//     }, 2000);
// })
// p1.then(() => { console.log(1) });  // 这种调用形式才会出现等待执行队列length>1
// p1.then(() => { console.log(2) });  // 这种调用形式才会出现等待执行队列length>1
// p1.then(() => { console.log(3) });
// setTimeout(() => {
//     p1.then(() => { console.log(4) });
// }, 2100);

//                 pending-- - 1 1
// promise.js: 133 pending-- - 2 2
// promise.js: 133 pending-- - 3 3
// promise.js: 253 1
// promise.js: 254 2
// promise.js: 255 3


// const test = async () => {
//     const res = await new MyPromise((resolve, reject) => {
//         console.log("构造函数内执行");
//         setTimeout(() => {
//             console.log("构造函数执行完毕， resolve");
//             resolve(1);
//         }, 1000);
//     })
//         .then((res) => {
//             console.log("第 1 个then 函数执行");
//             // 返回一个Promise对象
//             return new MyPromise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log("第 1 个then中返回的 Promise 执行完毕，resolve");
//                     resolve(res + 2);
//                 }, 2000);
//             });
//         })
//         .then((res) => {
//             console.log("第 2 个then 函数执行");
//             // 返回一个Promise对象
//             return new MyPromise((resolve, reject) => {
//                 setTimeout(() => {
//                     console.log("第 2 个then中返回的 Promise 执行完毕，resolve");
//                     resolve(res + 3);
//                 }, 2000);
//             });
//         })
//         .then((res) => {
//             console.log("第 3 个then 函数执行");
//             console.log("打印结果：", res);
//             return res + 3;
//         })
//         .then((res) => {
//             console.log("第 4 个then 函数执行");
//             console.log("打印结果：", res);
//             return res + 4;
//         });

//     console.log("res = ", res);
// };
// test()

new MyPromise((res, rej) => {
    res(1)
})
    .then(() => {
        console.log(2)
    })
    .then(() => {
        console.log(3)
    })