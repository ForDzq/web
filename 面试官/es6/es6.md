#### 1.var let const的区别
变量提升
暂时性死区
块级作用域
重复声明
修改声明的变量

1. var 声明的变量存在变量提升，即变量可以在声明前使用，值为undefined
   let const不存在变量提升，只能在声明后使用，否则报错
2. var 不存在暂时性死区
   let const 只有等到声明变量的那一行代码出现，才能获得和使用变量
3. let const 存在块级作用域
4. var 可以重复声明
5. const声明只读变量，不可修改（基本类型），且声明时就需要赋值
   
#### 2.es6数组新增了哪些扩展
