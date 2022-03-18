window.onload = function () {
    //商品详情模块 tab栏操作
    var detail_tab_list = document.querySelector('.detail_tab_list')
    var lis = detail_tab_list.querySelectorAll('li')
    var detail_tab_con = document.querySelector('.detail_tab_con')
    var items = detail_tab_con.querySelectorAll('.item')

    for (var i = 0; i < lis.length; i++) {
        lis[i].setAttribute('data-index', String(i)) //在这里设置5个li的索引号
        lis[i].onmouseover = function () {
            for (var i = 0; i < lis.length; i++) {
                lis[i].className = ''
            }
            this.className = 'current'
            for (var i = 0; i < items.length; i++) {
                items[i].style.display = 'none'
            }
            items[this.getAttribute('data-index')].style.display = 'block' //将tab栏对应的item显示出来
        }
    }
    detail_tab_list.setAttribute('data-index', 0)
    console.log(detail_tab_list.dataset.index)

    //仿京东放大镜效果
    var preview_img = document.querySelector('.preview_img')
    var mask = preview_img.children[1]
    var big = preview_img.children[2]

    //1. 鼠标经过小图片盒子 mask和大图片盒子显示，离开隐藏
    preview_img.addEventListener('mouseenter', function () {
        mask.style.display = 'block'
        big.style.display = 'block'
    })
    preview_img.addEventListener('mouseleave', function () {
        mask.style.display = 'none'
        big.style.display = 'none'
    })

    //黄色的遮挡层跟随鼠标移动
    //应该是把鼠标在小图片盒子的坐标 给mask
    preview_img.addEventListener('mousemove', function (e) {
        //(1) 先计算出鼠标在盒子内的坐标  先看小图片盒子是否有定位
        var x = e.pageX - this.offsetLeft;
        var y = e.pageY - this.offsetTop;
        //(2) 为了使鼠标在mask中间，-mask 宽高的一半
        //(3) mask不能超出小图片盒子 +判断条件解决
        var maskX = x - mask.offsetWidth / 2;
        var maskY = y - mask.offsetHeight / 2;
        var maskMaxX = this.offsetWidth - mask.offsetWidth;
        var maskMaxY = this.offsetHeight - mask.offsetHeight;
        //移动的最小距离和最大距离
        if (maskX <= 0) {
            maskX = 0;
        } else if (maskX >= maskMaxX) {
            maskX = maskMaxX;
        }
        if (maskY <= 0) {
            maskY = 0;
        } else if (maskY >= maskMaxY) {
            maskY = maskMaxY;
        }
        mask.style.left = maskX + 'px';
        mask.style.top = maskY + 'px';

        // (4) 大图片盒子移动距离与mask 成比例 maskX / mask 最大移动距离 = big / big最大移动距离
        var bigMaxX = big.firstElementChild.offsetWidth - big.offsetWidth; //300
        var bigMaxY = big.firstElementChild.offsetHeight - big.offsetHeight;
        var bigX = maskX / maskMaxX * bigMaxX; //根据比例公式计算
        var bigY = maskY / maskMaxY * bigMaxY;
        big.firstElementChild.style.left = -bigX + 'px'; //负值+单位！！
        big.firstElementChild.style.top = -bigY + 'px';
    })


}