var deepClone = (a, cache) => {
    if (!cache) cache = new Map()
    if (a instanceof Object) {
        if (cache.get(a)) { return cache.get(a) }
        let result = undefined
        if (a instanceof Function) {
            if (a.property) {
                result = function () { a.apply(this, arguments) }
            } else {
                result = (...args) => { a.call(undefined, ...args) }
            }
        } else if (a instanceof RegExp) {
            result = new RegExp(a.source, a.flags)
        } else if (a instanceof Date) {
            result = new Date(a - 0)
        } else if (a instanceof Array) {
            result = []
        } else {
            result = {}
        }
        cache.set(a, result)
        for (let key in a) {
            if (a.hasOwnProperty(key)) {
                result[key] = deepClone(a[key], cache)
            }
        }
        return result
    } else {
        return a
    }
}

var obj = {
    num: 1, bool: false, c: null, d: undefined,
    arr: [3, 5, { a: 1 }],
    obj2: { a: 3, d: 5, g: 8 }
}