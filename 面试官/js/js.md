#### 1.说说javascript中数据的类型，以及存储上的差别
1. 基本类型（Number,String,Boolean,null,Undefined,symbol） 引用类型(Array,Object,Function)
2. 基本数据类型存储在栈中 ; 引用类型的对象存储于堆中

#### 2.数组的常用方法有哪些
1.  增、删、改、查；哪些方法会对原数组产生影响（留意）
    1. 增
      1. push()      影响原数组   返回数组长度  数组末尾添加任意数量参数
      2. unshift()   影响原数组   返回数组长度  数组开头添加任意数量参数
      3. splice()    影响原数组   返回[删除的元素,删除的元素]的数组 splice(开始位置，删除数量，插入元素...)
      4. concat(b)               返回副本拼接参数后的新数组---b是一维数组可解,(b,[c,d],[[e,f],g])
    2. 删
      1. pop()       影响原数组   返回删除项 '删除的元素'
      2. shift()     影响原数组   返回删除项 '删除的元素'
      3. splice()    影响原数组
      4. slice()                 返回([begin[, end]]),包括begin,不包括end的新数组，参数可为负数，浅拷贝
    3. 改
      1. splice()    影响原数组
    4. 查
      1. indexOf()               返回要查找的元素在数组中的位置，如果没找到则返回 -1  ['4']中找不到4，Of大写O
      2. includes()              找到返回true，否则false，['4']中找不到4，
      3. find()                  返回第一个匹配的元素，arr.find((item,index,array)=> item.age > 28)

2. 排序方法
   1. reverse()       影响原数组  原数组引用不变，内部顺序变化
   2. sort()          影响原数组  接收一个比较函数 sort((a,b)=> a-b) 升序 >0,=0,<0
3. 转换方法
   1. join()                     方法接收一个参数，即字符串分隔符，返回包含所有项的字符串;默认是，
4. 迭代方法，都不改变原数组
   ((item, index, array) => item > 2)
   1. some()                     对数组每一项都运行传入的函数，如果有一项函数返回 true ，则这个方法返回 true
   2. every()                    对数组每一项都运行传入的函数，如果对每一项函数都返回 true ，则这个方法返回 true
   3. forEach()                  对数组每一项都运行传入的函数，没有【返回值】
   4. filter()     没有s         对数组每一项都运行传入的函数，函数返回 true 的项会组成数组之后返回
   5. map()                      对数组每一项都运行传入的函数，返回由每次函数调用的结果构成的数组


#### 3.字符串的常用方法有哪些
1. 增
    1. concat 'hello'.concat(' world') 
2. 删
    1. slice(beginIndex[, endIndex])
    2. substr(start[, length]) // 兼容性，有可能被遗弃
    3. substring(indexStart[, indexEnd])
3. 改
    1. trim()、trimLeft()、trimRight()
    2. repeat()
    3. padStart()、padEnd(6,',') 填充
    4. toLowerCase()、 toUpperCase()
4. 查
   1. chatAt()     (index)
   2. indexOf()
   3. startWith()  返回boolean
   4. includes()   返回boolean
5. 转换方法
   1. split 转换成数组
6. 模板匹配方法
   1. match()    正则表达式字符串/RegExp对象 返回数组
   2. search()   正则表达式字符串/RegExp对象 返回suo
   3. replace()