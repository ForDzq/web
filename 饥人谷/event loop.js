console.log(0)
setTimeout(() => { console.log(1) })
Promise.resolve('a')
    .then(() => {
        console.log(2)
        Promise.resolve().then(() => {
            console.log('xiao2')
        })
    })
    .then(() => { console.log(4) });
console.log(5)

// 第二题
Promise.resolve().then(() => {
    console.log(1)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(5)
})

Promise.resolve().then(() => {
    console.log(2)
}).then(() => {
    console.log(4)
}).then(() => {
    console.log(6)
})

queueMicrotask(() => {
    console.log('a')
    queueMicrotask(() => {
        console.log('c')
    })
})
queueMicrotask(() => {
    console.log('b')
    queueMicrotask(() => {
        console.log('d')
    })
})


Promise.resolve().then(() => { console.log('小任务4') })
setTimeout(() => {
    console.log(1)
    Promise.resolve().then(() => { console.log('小任务1') });
    Promise.resolve().then(() => { console.log('小任务2') })
});
Promise.resolve().then(() => { console.log('小任务3') })
setTimeout(() => {
    console.log(2)
});