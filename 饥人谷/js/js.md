#### js中的数据类型
string boolean number(-2^53-1 - 2^53-1) null undefined symbol bigInt(整数后加n) object

#### 原型链
比如 var a=new Array() a的__proto__是Array的prototype,是Object.prototype
解决在没有class的情况下实现继承
a.__proto__ = b    // 不推荐
var a = Object.create(b)
var a = new Cf()