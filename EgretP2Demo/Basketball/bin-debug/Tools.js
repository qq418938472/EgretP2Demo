var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Tools = (function () {
    function Tools() {
    }
    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
    */
    Tools.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
    * 传入数组，返回乱序后的数组
    */
    Tools.ArrayDisorder = function (arr) {
        var n = arr.length;
        var a = Tools.GetRandomArray(n, 0, n - 1);
        var newArr = [];
        for (var i = 0; i < n; i++) {
            newArr[i] = arr[a[i]];
        }
        return newArr;
    };
    Tools.GetRandomArray = function (len, Min, Max, allowConflict) {
        var num = new Array(len);
        var val;
        var isEqu = false;
        var testCount = 0;
        for (var i = 0; i < len; i++) {
            isEqu = false;
            val = this.GetRandomNum(Min, Max);
            for (var j = 0; j < i; j++) {
                if (num[j] == val) {
                    isEqu = true;
                    break;
                }
            }
            if (!allowConflict && isEqu)
                i--;
            else
                num[i] = val;
            if (testCount++ > 10000) {
                console.log("Dead loop!");
                break;
            }
        }
        return num;
    };
    Tools.GetRandomNum = function (Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        Rand = Min + Math.round(Rand * Range);
        return Rand;
    };
    Tools.setFilters = function (obj, color) {
        var _color = color || 0xFFFFFF; /// 光晕的颜色，十六进制，不包含透明度
        var _alpha = 0.5; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var _blurX = 35; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var _blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var _strength = 4; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var _quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var _inner = false; /// 指定发光是否为内侧发光，暂未实现
        var _knockout = false; /// 指定对象是否具有挖空效果，暂未实现
        var glowFilter = new egret.GlowFilter(color, _alpha, _blurX, _blurY, _strength, _quality, _inner, _knockout);
        obj.filters = [glowFilter];
    };
    /**
    * 友好设置列表数据，可以避免List重设数据后，滚动条跳回页首
    *
    */
    Tools.fixSetProvider = function (list, collection) {
        if (list.dataProvider) {
            var provider = list.dataProvider;
            provider.replaceAll(collection.source);
        }
        else {
            list.dataProvider = collection;
        }
    };
    /**
     * 友好设置列表数据，可以避免List重设数据后，滚动条跳回页首
     *
     */
    Tools.setArrayCollection = function (list, data) {
        if (data == null) {
            data = [];
        }
        //list.dataProvider = new eui.ArrayCollection(data);
        if (!list.dataProvider || data.length == 0) {
            list.dataProvider = new eui.ArrayCollection(data);
        }
        else {
            list.dataProvider.replaceAll(data);
        }
    };
    /**
    * 从父级移除child
    * @param child
    */
    Tools.removeFromParent = function (child) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    Tools.btnAddAnimation = function (imgArr) {
        var _loop_1 = function (i) {
            var img = imgArr[i];
            img.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
                egret.Tween.get(img).to({ scaleX: 0.9, scaleY: 0.9 }, 50);
            }, this_1);
            img.addEventListener(egret.TouchEvent.TOUCH_END, function () {
                egret.Tween.get(img).to({ scaleX: 1, scaleY: 1 }, 50);
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < imgArr.length; i++) {
            _loop_1(i);
        }
    };
    Tools.onFlash = function (obj, isStop) {
        if (isStop) {
            egret.Tween.removeTweens(obj);
            return;
        }
        egret.Tween.get(obj, { loop: true }).to({ scaleX: 1.2, scaleY: 1.2 }, 500).to({ scaleX: 1.0, scaleY: 1.0 }, 500);
    };
    /**
    * 图片在容器中自动居中（容器对象，需要摆放图片的个数）
    */
    Tools.getImgPositionArr = function (Group, imgNumber) {
        var containWidth = Group.width;
        var step = containWidth * 1.0 / imgNumber;
        var x_Arr = [];
        for (var k = 1; k <= imgNumber; k++) {
            x_Arr.push(step * k - step / 2);
        }
        console.log("x_Arr:" + x_Arr);
        return x_Arr;
    };
    Tools.createMovieClip = function (key) {
        var mcJson = RES.getRes(key + "_json");
        var mcImg = RES.getRes(key + "_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcJson, mcImg);
        return new egret.MovieClip(mcDataFactory.generateMovieClipData());
    };
    Tools.setColorMatrix = function (obj) {
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        obj.filters = [colorFlilter];
    };
    Tools.getNumWord = function (num) {
        var text;
        if (num > 100000000) {
            text = (num / 100000000).toString().match(/^\d+(?:\d{0})?/) + "亿";
        }
        else if (num > 10000000) {
            text = (num / 10000).toString().match(/^\d+(?:\d{0,0})?/) + "万";
        }
        else if (num > 1000000) {
            text = (num / 10000).toString().match(/^\d+(?:\.\d{0,1})?/) + "万";
        }
        else if (num >= 10000) {
            text = (num / 10000).toString().match(/^\d+(?:\.\d{0,2})?/) + "万";
        }
        else {
            text = num.toString();
        }
        return text;
    };
    return Tools;
}());
__reflect(Tools.prototype, "Tools");
//# sourceMappingURL=Tools.js.map