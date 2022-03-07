#### 1.BFC是什么
概念题：概念题：思路（是什么，怎么做，解决了什么问题，优点，缺点，怎么解决缺点）
1. BFC是块级格式化上下文（不要尝试解释）
2. 触发条件（MDN上10多种）[BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
     1. 浮动元素（float不为none）
     2. 绝对定位元素（position为absolute|fixed）
     3. overflow不为visible的块元素(可以是auto,scroll,hidden)   块元素？
     4. 行内块元素 inline_block
     5. 弹性元素（display为flex|inline_flex的直接子元素）
3. 解决了什么问题
     1. 清除浮动（自我疑惑：为什么不用.clearfix呢）
     2. 防止垂直方向margin合并
     3. 某些古老的布局方式会用到（不用提）

#### 2.如何实现垂直居中
实践题：建议自己写博客总结
1. [垂直居中](https://www.jianshu.com/p/1bae159bcb81)
2. 父没有height就用padding: 10px 0; 能不写height就不写height
3. 垂直居中
     1. table自带功能
     2. div用css装成table
     3. 100%高度的before after加上inline_blockinline_block(有优化版本)
     4. 绝对定位+margin负一半的值
     5. 绝对定位+transform负50%（注意transform：translate(-50%,-50%)）
     6. 绝对定位(各个方向0)+margin:auto
     7. flex
   
#### 3.css选择器优先级如何确定
实践题：
[MDN优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)
[css2.1的规格文档权威算法](http://www.ayqy.net/doc/css2-1/cascade.html) 不适合css3,因为新增了很多其他的选择器
1. !important
2. style 内联样式
3. id 选择器
4. 类选择器 .example ，属性选择器 [type='email']，伪类选择器 :hover
5. 元素选择器 h1，伪元素选择器 ::before

通配选择符（universal selector）（*）关系选择符（combinators）（+, >, ~, ' ', ||）和 否定伪类（negation pseudo-class）（:not()）对优先级没有影响。（但是，在 :not() 内部声明的选择器会影响优先级）。

1. 选择器越具体，优先级越高
2. 相同优先级，出现在后面的，覆盖前面的
3. 属性后面加！important的优先级最高，但要少用

[web前端面试 - 面试官系列](https://vue3js.cn/interview/typescript/typescript_javascript.html#%E4%B8%80%E3%80%81%E6%98%AF%E4%BB%80%E4%B9%88)


#### 4.如何清除浮动
实践题
    .clearfix:after {
        content:''
        display: block; // 或者table也可以
        clear: both
    }
    .clearfix {
        zoom: 1 // 兼容ie
    }

或者触发BFC，如overflow: hidden;都是放在父元素上
<div class="clear"></div> .clear{clear:both}

#### 5.两种盒模型的区别
区分题：
1. 一种是content-box width设置的是content的宽度，实际宽度=content+paddding+border  (w3c标准盒模型 firfox抢占标准)
2. 一种是border-box  width设置的是外边框之间的距离，实际宽度=width   ( IE盒模型 / 怪异盒模型)
3. 都是设置宽度的，但border-box更好用一点
