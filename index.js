/**
 * Created by luozhong on 17/1/18.
 */
(function () {
    "use strict";

    var sliderConDom = document.getElementById("sliderCon"),
        scrollConDom = document.getElementById("scrollContent"),
        sliderUlDom = document.getElementById("sliderUl"),//小圆点容器
        sliderLiDom = null,//小圆点
        contentWidth = sliderConDom.clientWidth,
        items = document.getElementsByClassName("slider-item"),
        itemsLen = items.length,
        activeSlider = 0,//当前激活的滑块index
        itemSlider = 0,//当前激活的滑块index
        slider_x = 0,//滑块移动的位置
        timer = 300,//时间差
        isRoll = false;//是否在执行动画

    scrollConDom.style.width = itemsLen * contentWidth + "px";
    //判断移动设备设备
    var versions = function () {
        var u = navigator.userAgent;
        return {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) //是否为移动终端
        };
    }();

    drag(scrollConDom);

    //获取样式名称正则
    function getClassName(className) {
        return new RegExp('(\\s|^)' + className + '(\\s|$)');
    }

    //判断元素是否含有某个class
    function hasClass(dom, className) {
        return dom.className.match(getClassName(className));
    }

    //向元素添加class
    function addClass(dom, className) {
        if (hasClass(dom, className)) {
            return
        }
        dom.className += " " + className;
    }

    //删除指定class
    function removeClass(dom, className) {
        if (hasClass(dom, className)) {
            dom.className = dom.className.replace(getClassName(className), "");
        }
    }

    //激活小圆点
    function activeLi(index) {
        //移除旧的激活项
        removeClass(sliderLiDom[activeSlider], "active");
        activeSlider = index;
        //设置当前激活选项
        addClass(sliderLiDom[index], "active");
    }

    //滑动到指定的滑块
    function sliderScroll(index) {
        var offsetLeft = 0;
        if (index) {
            offsetLeft = index * contentWidth;
        }
        isRoll = true;
        addClass(scrollConDom, "active");
        scrollConDom.style.transform = "translate3d(-" + offsetLeft + "px, 0px, 0px)";
        scrollConDom.style.mozTransform = "translate3d(-" + offsetLeft + "px, 0px, 0px)";
        scrollConDom.style.webkitTransform = "translate3d(-" + offsetLeft + "px, 0px, 0px)";

        removeClass(items[itemSlider], "active");// 移除当前激活的滑块的active样式
        itemSlider = index;
        addClass(items[index], "active");// 像目标滑块的添加active样式
        activeLi(index);//改变小圆点激活状态
        setTimeout(function () {
            isRoll = false;
            removeClass(scrollConDom, "active");
        }, timer);

        slider_x = 0 - offsetLeft;
    }

    //点击小圆点
    function clickItem(index) {
        if (isRoll) {//如果当前动画正在执行 则不做任何操作
            return
        }
        //如果当前点击小圆点是激活状态 则不做任何操作
        if (hasClass(sliderLiDom[index], "active")) {
            console.info("当前元素已经激活");
            return
        }
        sliderScroll(index);//调用滑动方法
    }

    //设置小圆点
    function setUl(index) {
        var li = document.createElement("li");
        if (index == 0) {
            li.className = "slider-ull-li active";
        } else {
            li.className = "slider-ull-li";
        }

        li.onclick = clickItem.bind(this, index);
        sliderUlDom.appendChild(li);
        if (!sliderLiDom) {
            sliderLiDom = document.getElementsByClassName("slider-ull-li");//小圆点
        }
    }

    function initSlider(){
        for (var i = 0; i < itemsLen; i++) {
            items[i].style.width = contentWidth + "px";
            setUl(i);
            if (i == 0) {
                items[0].className = items[0].className + " active";
            }
        }
    }

    //初始化slider元素

    function drag(dom) {
        if (!dom) {
            return;
        }
        initSlider();

        var isMousedown = false,//鼠标是否点击
            m_start_x = 0,//鼠标起始位置
            m_roll_x = 0,//滑块滑动的距离
            left = 0;
        //按下
        var optionDown = function (e) {
            e.stopPropagation();
            scrollConDom.style.cursor = "-webkit-grabbing";
            isMousedown = true;
            if (versions.mobile) {
                /** @namespace e.targetTouches */
                m_start_x = e.targetTouches[0].clientX;
            } else {
                m_start_x = e.clientX;
            }
        };

        //移动
        var optionMove = function (e) {
            if (!isMousedown) {
                return;
            }
            if (versions.mobile) {
                m_roll_x = e.targetTouches[0].clientX - m_start_x; //鼠标移动总距离和起始点差值为鼠标移动的距离
            } else {
                m_roll_x = e.clientX - m_start_x; //鼠标移动总距离和起始点差值为鼠标移动的距离
            }
            if ((m_roll_x > 0 && activeSlider == 0) || m_roll_x < 0 && activeSlider == itemsLen - 1) {//在最边缘拖动时距离变小
                left = slider_x + m_roll_x * 0.3;
            } else {
                left = slider_x + m_roll_x;
            }
            scrollConDom.style.transform = "translate3d(" + left + "px, 0px, 0px)";
            scrollConDom.style.mozTransform = "translate3d(" + left + "px, 0px, 0px)";
            scrollConDom.style.webkitTransform = "translate3d(" + left + "px, 0px, 0px)";
        };

        //抬起
        var optionUp = function (e) {
            if (!isMousedown) {
                return;
            }
            scrollConDom.style.cursor = "auto";
            e.stopPropagation();
            isMousedown = false;
            var s_index = activeSlider;
            if (m_roll_x < 0) {//向左滑动
                if (itemSlider == itemsLen - 1 || Math.abs(m_roll_x) < contentWidth / 3) {
                    s_index = itemSlider
                } else {
                    s_index = activeSlider + 1
                }
            } else if (m_roll_x > 0) {//向右滑动
                if (itemSlider == 0 || Math.abs(m_roll_x) < contentWidth / 3) {
                    s_index = itemSlider
                } else {
                    s_index = activeSlider - 1;
                }
            } else {
                return
            }
            sliderScroll(s_index);
        };

        if (versions.mobile) {//如果是移动端 则监听触摸事件
            addClass(sliderUlDom, "mobile");
            dom.addEventListener('touchstart', optionDown);
            dom.addEventListener('touchmove', optionMove);
            dom.addEventListener('touchend', optionUp);
        } else {
            dom.onmousedown = optionDown;
            document.onmouseup = optionUp;
            dom.onmousemove = optionMove;
        }

        console.log(this);
        console.log(document);
    }
})();