const PENDDING = 'pendding'
const FULFILLED = 'fulFilled'
const REJECTED = 'rejected'

class MyPromise {
    constructor(handler) {
        this._status = PENDDING
        this._value = undefined
        this._fulFilledQueues = []
        this._rejectedQueues = []

        try {
            handler(this._resolve.bind(this), this._reject.bind(this))
        } catch (error) {

        }
    }

    _resolve(val) {
        this._value = val
        this._status = FULFILLED
        let cb
        while (cb = this._fulFilledQueues.shift()) {
            cb(val)
        }
    }

    _reject(err) {
        this._value = err
        this._status = REJECTED
        let cb
        while (cb = this._rejectedQueues.shift()) {
            cb(err)
        }
    }

    then(resolved, rejected) {
        let { status, _value } = this
        return new MyPromise((resolveNext, rejectNext) => {

            switch (status) {
                case PENDDING:
                    this._fulFilledQueues.push(resolve)
                    this._rejectedQueues.push(reject)
                    break;

                case FULFILLED:
                    resolveNext(_value)
                    break;

                case REJECTED:
                    rejectNext(_value)
                    break;

                default:
                    break;
            }
        })
    }

    all() {

    }

    race() {

    }

    catch() {

    }
}