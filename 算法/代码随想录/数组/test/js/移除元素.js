// 27移除元素：简单 O(1)的空间
(() => {
    // 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。
    // 不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并 原地 修改输入数组。
    // 元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

    // 一个for完成需要两个for循环的暴力破解的方法
    function removeElement(nums, val) {
        let slow = 0
        for (let fast = 0, len = nums.length; fast < len; fast++) {
            if (val != nums[fast]) {
                nums[slow++] = nums[fast]
            }
        }
        return slow
    }

    // (元素的顺序可以改变)双指针优化：避免了需要保留的元素的重复赋值操作。
    function removeElement2(nums, val) {
        let left = 0, right = nums.length
        while (left < right) {
            if (nums[left] == val) {
                nums[left] = nums[right - 1]
                right--
            } else {
                left++
            }
        }
        return left
    }
})();

// 26删除排序数组中的重复项(已按升序排列) 简单
(() => {
    // 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。
    // 不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

    // 官方解法
    function removeDuplicates(nums) {
        const n = nums.length;
        if (n === 0) {
            return 0;
        }
        let fast = 1, slow = 1;
        while (fast < n) {
            if (nums[fast] !== nums[fast - 1]) {
                nums[slow] = nums[fast];
                ++slow;
            }
            ++fast;
        }
        return slow;
    }


    // 实践，可通过，官方解法先处理了[],才能fast-1
    function removeDuplicates2(nums) {
        let slowIndex = 0
        let tem = null
        for (let fastIndex = 0, len = nums.length; fastIndex < len; fastIndex++) {
            if (nums[fastIndex] !== tem) {
                nums[slowIndex++] = nums[fastIndex]
                tem = nums[fastIndex] // 
            }
        }
        return slowIndex // 返回的是长度
    }
})();

// 283.移动零
(() => {
    // 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
    function moveZeroes(nums) {
        let slow = 0
        for (let fast = 0, len = nums.length; fast < len; fast++) {
            if (nums[fast] !== 0) {
                [nums[slow], nums[fast]] = [nums[fast], nums[slow]] // 数组的解构赋值
                slow++
            }
        }
        return nums
    }
})();

// 844.比较含退格的字符串
(() => {
    // 给定 s 和 t 两个字符串，当它们分别被输入到空白的文本编辑器后，请你判断二者是否相等。# 代表退格字符。
    // 如果相等，返回 true ；否则，返回 false 。
    // 注意：如果对空文本输入退格字符，文本继续为空。
    // s = "ab#c", t = "ad#c"
})();