// 二分查找704：简单    --> 坚持循环不变量的原则
(() => {
    // 704
    // 一看就会，一写就费？
    // 循环不变量规则：while寻找中每一次边界的处理都要坚持根据区间的定义来操作
    // 有序是二分查找的基础，重复元素是否有影响看题目

    // 二分查找
    // 题目：给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 - 1。
    // 输入: nums = [-1, 0, 3, 5, 9, 12], target = 9
    // 输出: 4
    // 解释: 9 出现在 nums 中并且下标为 4  
    let nums = [-1, 0, 3, 5, 9, 12]
    let target = 9

    // 区间定义[left,right]
    function search(arr, target) {
        let left = 0
        let right = arr.length - 1 // 右侧闭区间，减1
        // if (target < arr[0] || target > arr[right]) return -1 // 不需要
        while (left <= right) {
            // let mid = parseInt((left + right) / 2)
            let mid = left + Math.floor((right - left) / 2);
            if (target == arr[mid]) {
                return mid
            } else if (target > arr[mid]) {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
        return -1
    }

    // 区间[left,rigt)
    function search2(arr, target) {
        let left = 0
        let right = arr.length // 右侧开区间所以，不用减1 测试arr = [5]
        // if (target < arr[0] || target > arr[right]) return -1 // 不需要
        while (left < right) {
            // let mid = parseInt((left + right) / 2)
            let mid = left + Math.floor((right - left) / 2);
            if (target == arr[mid]) {
                return mid
            } else if (target > arr[mid]) {
                left = mid + 1
            } else {
                right = mid
            }
        }
        return -1
    }
    let result = search(nums, target)
    console.log('二分查找', result)

    let result2 = search2(nums, target)
    console.log('二分查找2', result2)

    console.log('========================')
})();

// 相关推荐题目35: 简单 --> 搜索插入位置(35)
(() => {
    // 搜索插入位置(35)
    // 题目：给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
    // 请必须使用时间复杂度为 O(log n) 的算法
    // 升序
    // 输入: nums = [1, 3, 5, 6], target = 5
    // 输出: 2

    // [left,right]
    function searchInsert(nums, target) {
        // 方式一
        // let left = 0, right = nums.length - 1
        // while (left <= right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (target > nums[mid]) {
        //         left = mid + 1
        //     } else if (target < nums[mid]) {
        //         right = mid - 1
        //     } else {
        //         return mid
        //     }
        // }
        // return right + 1   // return left也可以通过 return哪一个考虑的是程序终止那个节点时各个当前值的状态

        // 方式二 其实就是寻找第一个大于等于target的位置
        let left = 0, right = nums.length - 1, ans = nums.length
        while (left <= right) {
            let mid = left + Math.floor((right - left) / 2)
            if (target > nums[mid]) {
                left = mid + 1
            } else {
                ans = mid
                right = mid - 1
            }
        }
        return ans
    }

    // [left,right)
    function searchInsert2(nums, target) {
        // 方式一
        // let left = 0, right = nums.length
        // while (left < right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (target > nums[mid]) {
        //         left = mid + 1
        //     } else if (target < nums[mid]) {
        //         right = mid
        //     } else {
        //         return mid
        //     }
        // }
        // return right // return left也可以通过

        // 方式二
        let left = 0, right = nums.length
        while (left < right) {
            let mid = left + Math.floor((right - left) / 2)
            if (target > nums[mid]) {
                left = mid + 1
            } else {
                right = mid
            }
        }
        return right
    }

    // 实践过程产物
    function searchPos(nums, target) {
        let left = 0, right = nums.length;
        // if (target <= arr[0]) return 0 // 其实没必要写这个边界条件判断
        // if (target > arr[right - 1]) return right // 其实没必要写这个边界条件判断
        while (left < right) {
            let mid = left + Math.floor((right - left) / 2)
            if (nums[mid] > target) {
                right = mid
            } else if (nums[mid] < target) {
                left = mid + 1
            } else {
                return mid
            }
        }
        return left
    }

    // console.log('搜索插入位置', searchInsert([9, 6, 3, 2, 1], 3)) 这道题是升序，不用考虑降序
    console.log('搜索插入位置', searchInsert([1, 2, 3, 6, 9], 3))
})();

// 相关推荐题目34：中等 --> 在排序数组中查找元素的第一个和最后一个位置
(() => {
    // 在排序数组中查找元素的第一个和最后一个位置
    // 题目：给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。如果数组中不存在目标值 target，返回[-1, -1]。
    // 二分搜索可以查找值，可以确定边界
    function searchRange(nums, target) {
        // 不包含target的左边界,从右往左不断逼近，如[1，3，5，7],tanget为3的左边界是0,target为-10的左边界是-1，target是10的左边界为-1
        function getLeftBorder(nums, target) {
            let left = 0, right = nums.length - 1
            let leftBorder = -2 // target在nums的右边
            while (left <= right) {
                let mid = left + Math.floor((right - left) / 2)
                if (target <= nums[mid]) {
                    right = mid - 1
                    leftBorder = right
                } else {
                    left = mid + 1
                }
            }
            return leftBorder
        }

        // 不包含target的右边界,从左往右不断逼近
        function getRightBorder(nums, target) {
            let left = 0, right = nums.length - 1
            let rightBorder = -2
            while (left <= right) {
                let mid = left + Math.floor((right - left) / 2)
                if (target >= nums[mid]) {
                    left = mid + 1
                    rightBorder = left
                } else {
                    right = mid - 1
                }
            }
            return rightBorder
        }

        let leftBorder = getLeftBorder(nums, target)
        let rightBorder = getRightBorder(nums, target)

        if (leftBorder == -2 || rightBorder == -2) return [-1, -1]
        if (rightBorder - leftBorder > 1) return [leftBorder + 1, rightBorder - 1]
        return [-1, -1]
    }
    function searchRange2(nums, target) {
        // [left,right)区间
        // 不包含target的左边界,从右往左不断逼近，如[1，3，5，7],tanget为3的左边界是0,target为-10的左边界是-1，target是10的左边界为-1
        function getLeftBorder(nums, target) {
            let left = 0, right = nums.length
            let leftBorder = -2 // target在nums的右边
            while (left < right) {
                let mid = left + Math.floor((right - left) / 2)
                if (target <= nums[mid]) {
                    right = mid
                    leftBorder = right - 1
                } else {
                    left = mid + 1
                }
            }
            return leftBorder
        }

        // 不包含target的右边界,从左往右不断逼近
        function getRightBorder(nums, target) {
            let left = 0, right = nums.length
            let rightBorder = -2
            while (left < right) {
                let mid = left + Math.floor((right - left) / 2)
                if (target >= nums[mid]) {
                    left = mid + 1
                    rightBorder = left
                } else {
                    right = mid
                }
            }
            return rightBorder
        }

        let leftBorder = getLeftBorder(nums, target)
        let rightBorder = getRightBorder(nums, target)

        if (leftBorder == -2 || rightBorder == -2) return [-1, -1]
        if (rightBorder - leftBorder > 1) return [leftBorder + 1, rightBorder - 1]
        return [-1, -1]
    }



    // 实践过程产物，无法确定是左边界还是右边界
    function searchRange3(nums, target) {
        let left = 0, right = nums.length - 1
        let start, end
        while (left <= right) {
            if (target > nums[mid]) {
                left = mid + 1
            } else if (target < nums[mid]) {
                right = mid - 1
            } else {

            }
        }
        return [-1, -1]
    }

})();

// x的平方根:69 简单
(() => {
    // 给你一个非负整数 x ，计算并返回 x 的 算术平方根 。
    // 由于返回类型是整数，结果只保留 整数部分 ，小数部分将被 舍去 。
    // 注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x ** 0.5 。

    function mySqrt(x) {
        // 通过 从右侧逼近
        // let left = 0, right = x
        // while (left <= right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (mid * mid > x) {
        //         right = mid - 1
        //     } else {
        //         left = mid + 1
        //     }
        // }
        // return right

        // 从左侧逼近
        // let left = 0, right = x, ans = -1
        // while (left <= right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (mid * mid <= x) {
        //         ans = mid
        //         left = mid + 1
        //     } else {
        //         right = mid - 1
        //     }
        // }
        // return ans

        // 解答错误 x=8
        // [left,right),从右侧逼近
        // let left = 0, right = x
        // while (left < right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (mid * mid >= x) {
        //         right = mid
        //     } else {
        //         left = mid + 1
        //     }
        // }
        // return left

        // 解答错误 x=4
        // [left,right),从右侧逼近
        // let left = 0, right = x
        // while (left < right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (mid * mid > x) {
        //         right = mid
        //     } else {
        //         left = mid + 1
        //     }
        // }
        // return left

        // 解答错误 x=0; right=x+1时可通过
        // [left,right),从右侧逼近
        // let left = 0, right = x, ans = -1
        // while (left < right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (mid * mid > x) {
        //         right = mid
        //     } else {
        //         ans = mid
        //         left = mid + 1
        //     }
        // }
        // return ans

        // 解答错误 x=0; 
        // [left,right),
        let left = 0, right = x + 1, ans = -1
        while (left < right) {
            let mid = left + Math.floor((right - left) / 2)
            if (mid * mid > x) {
                right = mid
                ans = mid - 1
            } else {
                left = mid + 1
            }
        }
        return ans

        // 解答错误 x=1
        // [left,right),从右侧逼近
        let left = 0, right = x, ans = 0
        while (left < right) {
            let mid = left + Math.floor((right - left) / 2)
            if (mid * mid > x) {
                right = mid
            } else {
                ans = mid
                left = mid + 1
            }
        }
        return ans


        // x为0不行 
        // let left = 0, right = x, ans = -1
        // while (left <= right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (mid * mid > x) {
        //         right = mid - 1
        //         ans = right
        //     } else {
        //         left = mid + 1
        //     }
        // }
        // return ans
    }


    // 实践产物，可运行
    function mySqrt2(x) {
        if (x < 1) return 0
        if (x < 4) return 1
        let left = 1, right = Math.floor(x / 2)
        while (left <= right) {
            let mid = left + Math.floor((right - left) / 2)
            if (mid * mid > x) {
                right = mid - 1
            } else if (mid * mid < x) {
                left = mid + 1
            } else {
                return mid
            }
        }
        return right // return left 也通过
    }
})();

// 有效完全平方数
(() => {
    function isPerfectSquare(num) {
        //[left,right]
        // let left = 1, right = num
        // while (left <= right) {
        //     let mid = left + Math.floor((right - left) / 2)
        //     if (mid * mid < num) {
        //         left = mid + 1
        //     } else if (mid * mid > num) {
        //         right = mid - 1
        //     } else {
        //         return true
        //     }
        // }
        // return false

        //[left,right)
        let left = 1, right = num + 1
        while (left < right) {
            let mid = left + Math.floor((right - left) / 2)
            if (mid * mid < num) {
                left = mid + 1
            } else if (mid * mid > num) {
                right = mid
            } else {
                return true
            }
        }
        return false
    }
})();