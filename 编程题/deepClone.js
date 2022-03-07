function getEmptyArrOrObj(origin) {
    let type = Object.prototype.toString.call(origin)
    if (type == '[object Object]') {
        return {}
    } else if (type == '[object Array]') {
        return []
    }
    return origin
}

function deepClone(orgin) {
    let queue = []
    let map = new Map()
    let target = getEmptyArrOrObj(origin)
    if (target !== orgin) {
        queue.push([orgin, target])
        map.set(origin, target)
    }
    while (queue.length) {
        let [ori, tar] = queue.shift()
        for (let key in ori) {
            if (ori.hasOwnProperty(key)) {
                // 不在原型上
                if (map.get(ori[key])) {
                    // tar[key] = ori[key]
                    tar[key] = map.get(ori[key])
                    continue
                }

                tar[key] = getEmptyArrOrObj(ori[key])
                if (tar[key] != ori[key]) {
                    queue.push([ori[key], tar[key]])
                    map.set(ori[key], tar[key])
                }
            }
        }
    }
    return target
}