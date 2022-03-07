### watch 和computed的区别
1. computed是计算属性，主要用于模板中某个值需要一个或多个数据计算得到
2. watch是监视，用于监听值的变化后对新值做逻辑处理
   
   1. 为什么计算属性有缓存功能？
      1. 计算属性经过计算后，内部的标志位dirty会表明已经计算过了，再次访问时会直接读取计算后的值
      2. 因为Object.defineProperty方法将属性计算属性的key绑定到target时，他的getter是computedGetter
   2. 为什么计算属性内的响应式数据发生变更后，计算属性会重新计算？
      1. 因为内部的响应式数据会收集computed-watcher，变更后通知计算属性要进行计算，也会通知页面重新渲染，渲染时会读取到重新计算后的值。
   3. $watch()会返回一个函数，用来停止触发回调
      1. immediate会立即执行回调
      2. deep: true 创建watcher实例的时候会执行get,traverse把obj对象内部所有的值都递归的读一遍