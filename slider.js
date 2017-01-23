/**
 * User: luozhong
 * Date: 17/1/23
 * Time: 14:50
 * email:luozhong0521@163.com
 */
(function(){
    "use strict";
    function Drag(obj) {
        if (!obj || typeof obj.sliderId == "undefined" || typeof obj.content == "undefined") {
            console.error("请传入正确的参数，{dom:'xxx',content:'xxx'}");
            return;
        }
        this.obj = obj;
        this.sliderDom = document.getElementById(obj.sliderId);//滑块
        this.sContentDom = document.getElementById(obj.content);//滑块容器
        this.sContentWidth = this.sContentDom.clientWidth;
        this.sliderWidth = this.sliderDom.clientWidth;
        this.start_x = 0;//当前元素开始位置
        this.init();
    }

    Drag.prototype = {
        init: function () {
            if (this.versions.mobile) {
                this.sliderDom.addEventListener('touchstart', this.optionDown.bind(this));
            } else {
                this.sliderDom.onmousedown = this.optionDown.bind(this);
            }
        },
        optionDown: function (e) {
            this.offset_x = this.sliderDom.style.marginLeft.replace("px", "") - 0;
            if (this.versions.mobile) {
                this.start_x = e.targetTouches[0].clientX;
                this.sliderDom.addEventListener('touchmove', this.optionMove.bind(this));
                this.sliderDom.addEventListener('touchend', this.optionUp.bind(this));
            }else{
                this.start_x = e.clientX;
                document.onmousemove = this.optionMove.bind(this);
                document.onmouseup = this.optionUp.bind(this);
            }
        },
        optionMove: function (e) {
            if (this.versions.mobile) {
                this.move_x = e.targetTouches[0].clientX - this.start_x + this.offset_x;//滑块移动的位置
            } else {
                this.move_x = e.clientX - this.start_x + this.offset_x;//滑块移动的位置
            }

            if (this.move_x < 0) {//左滑超出了范围
                this.move_x = 0;
            }
            if (this.move_x + this.sliderWidth > this.sContentWidth) {//右滑超出了范围
                this.move_x = this.sContentWidth - this.sliderWidth;
            }

            this.move(this.sliderDom, this.move_x);
            if (this.obj.func) {
                this.obj.func(this.move_x);
            }
        },
        optionUp: function () {
            document.onmousemove = null;
            document.onmouseup = null;
        },
        versions: function () {
            var u = navigator.userAgent;
            return {
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) //是否为移动终端
            };
        }(),
        move: function (item, x) {
            if (item.constructor == String) {
                item = document.getElementById(item);
            }
            if (typeof item == "undefined") {
                return
            }
            item.style.marginLeft = x + 'px';
        }
    };
    var drag1 = new Drag({
        "sliderId": "slider1",
        "content": "sContent",
        "func": function (r) {
            drag1.move("slider2", r);
        }
    });
    var drag2 = new Drag({
        "sliderId": "slider2",
        "content": "sContent",
        "func": function (r) {
            drag2.move("slider1", r);
        }
    });
})();
