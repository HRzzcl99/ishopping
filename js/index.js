$(function () {
    // var search = document.querySelector('.search')
    // console.dir(search)
    //这里用keydown并不合适，因为按下很快，光标定位到input表单后，输入s
    //为什么不试试用keyup？
    // document.addEventListener('keyup', function (e) {
    //     if (e.key == 's') {
    //         search.firstElementChild.focus();
    //     }
    // })

    alert(
        "项目包含页面: \n index.html 电商网站主页\n list.html 商品详情页 (点击轮播图跳转)\n login.html 用户登录页面\n shopcar.html 购物车页面\n submit.html 订单提交页面"
    )
    alert(" 每个页面实现基础交互功能: \n轮播图 \n商品放大镜效果 \n电梯导航栏 \n下拉菜单tab栏切换 \n注册登录验证 \n搜索框推荐")
    alert(" 制作人:黄容\n 指导老师:pink \n 技术栈: html + css + jQuery")

    // 搜索栏推荐
    //搜索框检测用户输入
    var up = -1;
    $('#iptSearch').blur(function () {
        up = -1;
        $('.suggest-list').empty().hide();
    })
    $('#iptSearch').keyup(function (e) {
        clearTimeout(timer);
        var keywords = $(this).val().trim();
        //没有输入则隐藏搜索推荐列表
        if (keywords.length <= 0) {
            up = -1;
            return $('.suggest-list').empty().hide();
        }
        if (e.keyCode === 27) {
            up = -1;
            $(this).blur();
            return $('.suggest-list').empty().hide();
        }
        console.log(e.keyCode);
        //允许用户利用上下键 在搜索推荐列表中选择
        if (e.keyCode === 40 || e.keyCode === 38) {
            if (e.keyCode === 40) {
                up++;
            } else {
                up--;
            }
            if (Math.abs(up) > $('.suggest-list').children().length) {
                up = 0;
            }
            $('.suggest-item a').removeClass();
            $('.suggest-item a').eq(up).addClass('suggest-current');
        } else {
            debounceSearch(keywords);
        }
    })
    //发起JSONP请求 获取并渲染搜索推荐列表
    function getSuggestList(keywords) {
        $.ajax({
            url: 'https://suggest.taobao.com/sug?q=' + keywords,
            dataType: 'jsonp',
            success: function (res) {
                console.log(res);
                renderSuggestList(res);
            }
        });
    }
    //渲染搜索列表
    function renderSuggestList(res) {
        if (res.result.length <= 0) {
            return $('.suggest-list').empty().hide();
        }
        var tplStr = template('tpl-suggestList', res);
        $('.suggest-list').html(tplStr).show();
    }
    //输入框防抖
    var timer = null;

    function debounceSearch(keywords) {
        timer = setTimeout(function () {
            getSuggestList(keywords);
        }, 500)
    }



    //轮播图模块
    var swiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        loop: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: { //可选选项，自动滑动
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true, //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });

    //节流阀 互斥锁
    var flag = true;
    //键盘捕获s 光标定位到搜索框
    $(document).keyup(function (e) {
        if (e.which == 83) {
            $('.search input').focus();
        }
    })
    //页面滚动事件
    // 显示电梯导航栏
    function showTool() {
        //页面滚动到今日推荐模块, 电梯导航显示
        if ($(document).scrollTop() >= $('.likes').offset().top) {
            $('.fixedtool').fadeIn();
        } else {
            $('.fixedtool').fadeOut();
        }
    }
    showTool(); //一开始就调用一次 防止刷新需要滚动才显示bug
    $(window).scroll(function () {
        //当页面滚动到对应的商品类,电梯导航对应的标签高亮
        showTool();
        if (flag) {
            $('.floor .content-block').each(function (i, dom) {
                //需要满足的是当前商品栏距离顶部0, 同时下方商品栏距离顶部大于前者的高度
                let height = $(this).height(); //400
                let thisTop = $(this).offset().top;
                // let nextTop = $('.floor .content-block').eq(i + 1).offset().top;
                // console.log('height' + height);
                // console.log('thisTop' + thisTop);
                // console.log($(document).scrollTop());
                //还是有bug 下滑没问题,上滑没办法显示对应的li,因为该条件只有上一个li才满足头部被卷去
                if ($(document).scrollTop() > (thisTop - 100) && $(document).scrollTop() <= thisTop + height / 2) {
                    $('.fixedtool li').eq(i).addClass('current').siblings().removeClass('current'); //对应高亮
                }
            })
        }
    })
    //点击对应的电梯,显示对应的模块 当前点击li高亮
    //点击事件发生会导致页面滚动到对应区域, 页面滚动又会导致当前模块高亮的问题
    //所以需要节流阀,点击事件发生,就并不触动滚动事件li高亮,当点击事件结束解锁
    $('.fixedtool li').click(function () {
        flag = false;
        let index = $(this).index();
        let current = ($('.floor .content-block').eq(index).offset().top);
        console.log('current' + current);

        //直接添加太生硬了 最好做成动画效果 动画必须给元素添加
        // $(window).scrollTop(scrollTop);
        $('body, html').stop().animate({
            scrollTop: current,
        }, function () {
            flag = true;
        })
        //当前点击 li 添加高亮 其余去掉高亮
        $(this).addClass('current').siblings().removeClass('current');
    })

    //下拉菜单对应tab切换
    console.log($('.all-sort-list2 .item').length); //15个分栏
    $('.all-sort-list2 .item').mouseenter(function () {
        $(this).find('h3 a').addClass('hover');
        $(this).find('.item-list').show();
    })
    $('.all-sort-list2 .item').mouseleave(function () {
        $(this).find('h3 a').removeClass('hover');
        $(this).find('.item-list').hide();
    })


})