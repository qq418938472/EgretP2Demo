class Tools {

    public static stageWidth;
    public static stageHeight;
    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
    */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
    * 传入数组，返回乱序后的数组
    */
    public static ArrayDisorder(arr) {
        var n = arr.length;
        var a = Tools.GetRandomArray(n, 0, n - 1);
        var newArr = [];
        for (var i = 0; i < n; i++) {
            newArr[i] = arr[a[i]];
        }
        return newArr;
    }

    public static GetRandomArray(len: number, Min: number, Max: number, allowConflict?: boolean) {
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
    }

    public static GetRandomNum(Min: number, Max: number) {
        var Range = Max - Min + 1;
        var Rand = Math.random();
        Rand = Min + Math.floor(Rand * Range);
        return Rand;
    }

    public static setFilters(obj: egret.DisplayObject, color?) {
        var _color: number = color || 0xFFFFFF;        /// 光晕的颜色，十六进制，不包含透明度
        var _alpha: number = 0.5;             /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var _blurX: number = 35;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var _blurY: number = 35;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var _strength: number = 4;            /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var _quality: number = egret.BitmapFilterQuality.HIGH;        /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var _inner: boolean = false;            /// 指定发光是否为内侧发光，暂未实现
        var _knockout: boolean = false;            /// 指定对象是否具有挖空效果，暂未实现
        var glowFilter: egret.GlowFilter = new egret.GlowFilter(color, _alpha, _blurX, _blurY,
            _strength, _quality, _inner, _knockout);

        obj.filters = [glowFilter];
    }

    /**
    * 友好设置列表数据，可以避免List重设数据后，滚动条跳回页首
    * 
    */
    public static fixSetProvider(list: eui.List, collection: eui.ArrayCollection): void {
        if (list.dataProvider) {
            let provider: eui.ArrayCollection = list.dataProvider as eui.ArrayCollection;
            provider.replaceAll(collection.source)
        } else {
            list.dataProvider = collection;
        }
    }
    /**
     * 友好设置列表数据，可以避免List重设数据后，滚动条跳回页首
     * 
     */
    public static setArrayCollection(list: eui.List, data: any): void {
        if (data == null) {
            data = [];
        }
        //list.dataProvider = new eui.ArrayCollection(data);
        if (!list.dataProvider || data.length == 0) {
            list.dataProvider = new eui.ArrayCollection(data);
        }
        else {
            (list.dataProvider as eui.ArrayCollection).replaceAll(data);
        }
    }

    /**
    * 从父级移除child
    * @param child
    */
    public static removeFromParent(child: egret.DisplayObject) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    }

    /**
    * 图片在容器中自动居中（容器对象，需要摆放图片的个数）
    */
    public static getImgPositionArr(Group: eui.Group, imgNumber: number): Array<number> {
        var containWidth: number = Group.width;
        var step: number = containWidth * 1.0 / imgNumber;
        var x_Arr = [];
        for (var k = 1; k <= imgNumber; k++) {
            x_Arr.push(step * k - step / 2);
        }
        console.log("x_Arr:" + x_Arr);
        return x_Arr;
    }

    public static createMovieClip(key: string): egret.MovieClip {
        var mcJson = RES.getRes(key + "_json");
        var mcImg = RES.getRes(key + "_png");
        var mcDataFactory = new egret.MovieClipDataFactory(mcJson, mcImg);
        return new egret.MovieClip(mcDataFactory.generateMovieClipData());
    }

    private static sound: egret.Sound;
    private static soundChennel: egret.SoundChannel;
    private static currentPlayPoint: number = 0;
    public static currentPlayKey: string = "";
    private static callback: Function;
    public static audioTimer: egret.Timer;
    private static audioWaitTime: number;
    private static context1;
    public static audioPlay(key: string, callback: Function = function () { }, waitTime: number = 0, context1: Object = this): void {
        if (key != "") {
            this.currentPlayKey = key;
            this.currentPlayPoint = 0;
            this.callback = callback;
            this.audioWaitTime = waitTime;
            this.context1 = context1;
        }
        if (!this.sound) {
            this.sound = new egret.Sound();
        }
        if (this.currentPlayKey != "") {
            this.sound.removeEventListener(egret.Event.COMPLETE, this.onSoundComplete, this);
            this.sound.addEventListener(egret.Event.COMPLETE, this.onSoundComplete, this);
            try {
                this.sound.load(RES.getRes(this.currentPlayKey).url);
            } catch (e) {
                alert("请检查语音文件是否正确: " + key);
            }
        }
        else if (Tools.audioTimer) {
            if (Tools.audioTimer.currentCount != Tools.audioTimer.repeatCount) {
                Tools.audioTimer.start();
            }
        }
    }

    public static onSoundComplete(event: egret.Event) {
        if (this.soundChennel) {
            this.soundChennel.stop();
        }
        this.sound = <egret.Sound>event.target;
        this.soundChennel = this.sound.play(this.currentPlayPoint, 1);
        this.soundChennel.addEventListener(egret.Event.SOUND_COMPLETE, () => {
            this.currentPlayPoint = 0;
            this.currentPlayKey = "";
            this.audioTimer = new egret.Timer(this.audioWaitTime, 1);
            this.audioTimer.addEventListener(egret.TimerEvent.TIMER, this.audioTimerFunc, this);
            this.audioTimer.start();
        }, this);
    }

    public static audioTimerFunc() {
        this.removeAudioTimerFunc();
        this.callback.call(this.context1);
    }

    public static removeAudioTimerFunc() {
        if (this.audioTimer && this.audioTimer.currentCount > 0) {
            this.audioTimer.removeEventListener(egret.TimerEvent.TIMER, this.audioTimerFunc, this);
            this.audioTimer = null;
        }
    }

    public static audioStop() {
        if (this.soundChennel) {
            this.currentPlayPoint = this.soundChennel.position;
            this.soundChennel.stop();
            if (Tools.audioTimer) {
                if (Tools.audioTimer.currentCount != Tools.audioTimer.repeatCount) {
                    Tools.audioTimer.stop();
                }
            }
        }
    }

    public static audioArrPlay(arr: string[]) {
        var index = 0;
        var callback = function () {
            if (++index < arr.length) {
                Tools.audioPlay(arr[index], callback);
            }
        }
        Tools.audioPlay(arr[index], callback);
    }

    public static IOSautoPlay() {
        var sound = new egret.Sound();
        sound = RES.getRes("right_mp3");
        var soundChennel = sound.play(0, 1);
        soundChennel.volume = 0;
        egret.setTimeout(function () {
            soundChennel.stop();
        }, this, 200);
    }
}