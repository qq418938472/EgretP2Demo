var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DataManager = (function () {
    function DataManager() {
    }
    Object.defineProperty(DataManager, "money", {
        get: function () {
            return this._money;
        },
        set: function (v) {
            if (v < 0)
                v = 0;
            this._money = v;
            GameEventManager.getInstance().dispatchEventWith(GameEventManager.SET_MONEY);
        },
        enumerable: true,
        configurable: true
    });
    DataManager.init = function () {
        DataManager.totalScore = 0;
        DataManager.savePeopleNum = 0;
        DataManager.userName = '芭芭拉小魔仙';
        DataManager.levels = RES.getRes("level_json");
        DataManager.dataArr = RES.getRes("shoppingMall_json");
    };
    DataManager._money = 0;
    DataManager.countDown = 20;
    return DataManager;
}());
__reflect(DataManager.prototype, "DataManager");
//# sourceMappingURL=DataManager.js.map