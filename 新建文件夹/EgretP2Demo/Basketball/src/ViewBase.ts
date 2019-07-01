/**
 * 视图基类
 * 视图的生命周期依次为 load、onload、onshow、onhide、dispose
 * @author longbin
 * 
 */
class ViewBase extends eui.Component implements eui.UIComponent {
    /**当前是否第一次创建完毕 */
    private $isChildrenCreated: boolean = false;
    /**显示时的缓动效果 */
    public easeShow: string = "slowlyShow";
    /**移除时的缓动效果 */
    public easeHide: string = "slowlyHide";
    /**显示状态 0初始 1调用了onshow 2调用了onhide */
    private showStatus: number = 0;
    /**是否需要半透明背景 */
    protected isHaveBg = false;
    protected isMainChild: boolean = false;
    protected isCentered = true;

    constructor() {
        super();
        this.touchEnabled = false;
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.__onAddToStage, this);
        this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.__onRemoveFromeStage, this);
    }

    protected partAdded(partName: string, instance: any): void {
        super.partAdded(partName, instance);
    }

    /**
	*EUI创建子类的方法，在组件第一次添加到舞台的时候会调用，可以用于创建子UI
	*/
    protected createChildren(): void {
        super.createChildren();
        if (this.isHaveBg) {
            var darkSprite = new egret.Shape();
            darkSprite.graphics.beginFill(0x000000, 0.7);
            darkSprite.graphics.drawRect(0, -(Tools.stageHeight - 1140) / 2, Tools.stageWidth, Tools.stageHeight);
            darkSprite.graphics.endFill();
            darkSprite.touchEnabled = true;
            if (this.isCentered) {
                this.anchorOffsetX = this.width / 2;
                this.anchorOffsetY = this.height / 2;
                this.x = Tools.stageWidth / 2;
                this.y = Tools.stageHeight / 2;
            }
            else {
                darkSprite.y = (Tools.stageHeight - 1140) / 2;
            }
            this.addChildAt(darkSprite, 0);
        }
        this.load();
    }

	/**
	 * EUI在创建完所有子类后会调用此方法
	 * 
	 */
    protected childrenCreated(): void {
        super.childrenCreated();
        this.onload();
        this.$isChildrenCreated = true;
        if (this.parent) {
            //创建完后如果已经添加进场景则调用
            this.__onAddToStage();
        }

        if (this.isMainChild) {
            this.y += (Tools.stageHeight - 1140) / 2;
            //this.x =(Tools.stageWidth-640)/2;
        }
    }

    private __onAddToStage(): void {
        if (this.$isChildrenCreated && this.showStatus !== 1) {
            this.onshow();
            this.showStatus = 1;
            Animation.getInstance().animationPlay(this.easeShow, this, 250);
        }
    }

    private __onRemoveFromeStage(): void {
        egret.Tween.removeTweens(this);
        this.onhide();
        this.showStatus = 2;
    }

    /**
     * 开始加载皮肤。
     * 一般在这里设置skinName，即开始初始化皮肤
     * 
     */
    protected load(): void {

    }

    /**
     * 皮肤加载完毕，组件首次激活触发，开始可以获取到所有组件的引用。
     * 一般可在这里监听UI组件事件
     * 
     */
    protected onload(): void {

    }

    /**
     * 添加进显示列表的时候触发，即通过addChild将界面添加进父容器之后触发，需要考虑在实例存在期间可能会被频繁添加到各类容器的情况。
     * 一般会在这里监听全局事件，和请求跟全局事件有关的数据
     * 
     */
    protected onshow(): void {

    }

    /**
     * 从显示列表移除的时候触发，即通过removeChild将界面从父容器移除之后触发，需考虑在实例存在期间可能会被频繁从父容器移除的情况。
     * 一般会在这里移除对全局事件的监听
     */
    protected onhide(): void {

    }

    /**
     * 从显示列表移除自身
     * 
     */
    public hide(): void {
        Animation.getInstance().animationPlay(this.easeHide, this, 250, Tools.removeFromParent.bind(this, this), Tools);
    }

    /**
     * 调用销毁，销毁和removeChild不同，removeChild只是从显示列表移除，销毁是将内部的数据引用清掉，降低内存泄漏的几率
     * 在dispose里需要清除引用数据，将引用数据置为undefined，达到内存回收的目的
     * 
     */
    public dispose(): void {
        let children = this.$children;
        children.forEach(function (child: egret.DisplayObject, index: number, array: egret.DisplayObject[]): void {
            if ("dispose" in child && typeof child["dispose"] == "function") {
                child["dispose"].call(child);
            }
        });
    }
}