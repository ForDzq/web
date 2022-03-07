function unique1(a) {
    // return Array.from(new Set(a))
    return [...new Set(a)]
}

function unique2(a) {
    let map = {} // 缺点：key会变成字符串
    for (let i = 0; i < a.length; i++) {
        let val = a[i]
        if (val in map) {
            continue
        }
        map[val] = true
    }
    // return [...Object.keys(map)]
    let result = []
    for (let key in map) {
        result.push(key)
    }
    return result
}

function unique3(a) {
    let map = new Map()
    for (let i = 0; i < a.length; i++) {
        let val = a[i]
        if (map.get(val)) {
            continue
        }
        map.set(val, true)
    }
    return [...map.keys()]
}

