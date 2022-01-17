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