class Result extends ViewBase {
    public constructor() {
        super();
    }

    private reStartBtn: eui.Button;
    protected onload(): void {
        this.skinName = ResultSkin;
    }

    protected onshow() {
        this.initUI();
        this.reStartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reStart, this);
    }

    private reStart() {
        DataManager.levelIndex = 0;
        var calculate = new Calculate();
        LayerManager.addChildLayer(calculate);
        this.hide();
    }

    private countGroup: eui.Group;
    private countNums: Array<eui.Image>;
    private inputGroup: eui.Group;
    private tips: eui.Image;
    private rotationBg: eui.Image;
    private savePeopleNum: eui.Label;
    protected initUI() {
        this.countNums = [];
        for (var i = 0; i <= 3; i++) {
            this.countNums.push(<eui.Image>this.countGroup.getChildAt(i));
            this.countNums[i].source = 'score0_png';
        }
        var nums = DataManager.totalScore.toString().split('').reverse();
        for (var i = 0; i <= nums.length - 1; i++) {
            this.countNums[i].source = 'score' + nums[i] + '_png';
        }
        egret.Tween.get(this.rotationBg, { loop: true })
            .to({ rotation: 360 }, 4000)
        var input: egret.TextField = new egret.TextField();
        this.inputGroup.addChild(input);
        input.width = 481;
        input.height = 123;
        input.size = 50;
        input.textColor = 0xe0e9cf;
        input.x = 0;
        input.y = 0;
        input.border = false;
        input.verticalAlign = egret.VerticalAlign.MIDDLE;
        input.textAlign = 'center';
        this.savePeopleNum.text = String(DataManager.savePeopleNum);
        /*** 本示例关键代码段开始 ***/
        input.type = egret.TextFieldType.INPUT;
        input.addEventListener(egret.FocusEvent.FOCUS_IN, function (e: egret.FocusEvent) {
            this.tips.visible = false;
        }, this);
        input.addEventListener(egret.FocusEvent.FOCUS_OUT, function (e: egret.FocusEvent) {
            if (input.text == "") {
                this.tips.visible = true;
            }
        }, this);
        input.addEventListener(egret.Event.CHANGE, function (e: egret.Event) {
        }, this);
        /*** 本示例关键代码段结束 ***/
        DataManager.totalScore = 0;
        DataManager.savePeopleNum = 0;
        Tools.audioArrPlay(["result_mp3", "result_mp3"]);
    };

}