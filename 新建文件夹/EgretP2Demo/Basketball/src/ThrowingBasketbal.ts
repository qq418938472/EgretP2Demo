class ThrowingBasketbal extends ViewBase {
	public constructor() {
		super();
	}

	public static _instance: ThrowingBasketbal;
	public static getInstance(): ThrowingBasketbal {
		if (!this._instance) {
			this._instance = new ThrowingBasketbal();
		}
		return this._instance;
	}

	public button_closed: eui.Button;
	public hand: eui.Image;
	public BasketFrame2: eui.Image;
	public Basketball: eui.Image;
	public BasketFrame1: eui.Image;
	public pointGroup: eui.Group;

	protected isHaveBg = true;
	private answerCount: number = 0;
	private scoreList = [];

	private _distance = new egret.Point(0, 0);
	private leftBasketFrame: p2.Body;
	private rightBasketFrame: p2.Body;
	private bottomDesk: p2.Body;

	private isRight: boolean = false;
	protected isCentered = false;


	protected onload() {
		this.CreateWorld();
		//this.createDebugDraw();

		let leftPlane = this.CreatePlane(30, 0, -Math.PI / 2);
		let rightPlane = this.CreatePlane(Tools.stageWidth - 30, 0, Math.PI / 2);
		this.leftBasketFrame = this.CreateBox({ width: 4.75, height: 18, position: [0, 0], mass: 1 });
		this.rightBasketFrame = this.CreateBox({ width: 4.75, height: 18, position: [0, 0], mass: 1 });
		this.bottomDesk = this.CreateBox({ width: 10, height: 92, position: [452, 781.5], mass: 1, angle: Math.PI / 2 });
		this.setBasketFrameX();

		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClick, this);
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTapEnd, this)
		this.button_closed.addEventListener(egret.TouchEvent.TOUCH_TAP, this.hide, this);

		//添加圆形刚体
		var circleShape: p2.Shape = new p2.Circle({ radius: 34.5 });
		this.basketballBody = new p2.Body({
			mass: 1,
			position: [452, 742],
			type: p2.Body.DYNAMIC,
			fixedRotation: true,
			damping: 0
		});
		this.basketballBody.addShape(circleShape);
		this.world.addBody(this.basketballBody);
		this.basketballBody.displays = [this.Basketball];

		this.addContactMaterial(this.basketballBody, this.leftBasketFrame);
		this.addContactMaterial(this.basketballBody, this.rightBasketFrame);
		this.addContactMaterial(this.basketballBody, leftPlane);
		this.addContactMaterial(this.basketballBody, rightPlane);
	}

	protected onshow() {
		this.pointGroup.visible = false;
		this.scoreList = [];
		this.answerCount = 0;
		this.addEventListener(egret.Event.ENTER_FRAME, this.update, this);
	}

	private setBasketFrameX() {
		this.leftBasketFrame.position = [this.BasketFrame1.x + 2.375, this.BasketFrame1.y + 17];
		this.rightBasketFrame.position = [this.BasketFrame1.x + this.BasketFrame1.width - 2.375, this.BasketFrame1.y + 17];
	}

	private world: p2.World;
	private CreateWorld() {
		this.world = new p2.World();
		//设置world为睡眠状态
		this.world.sleepMode = p2.World.BODY_SLEEPING;
		this.world.gravity = [0, 9.81];
	}

	/**创建盒子 */
	private CreateBox(prop): p2.Body {
		let box: p2.Box = new p2.Box({ width: prop.width, height: prop.height });
		let body = new p2.Body({
			mass: prop.mass,
			//刚体类型
			type: p2.Body.STATIC,
			//刚体的位置
			position: prop.position,
			angle: prop.angle || 0
		});
		body.addShape(box);
		this.world.addBody(body);
		return body;
	}

	private CreatePlane(x: number, y: number, angle): p2.Body {
		//创建一个shape形状
		let planeShape: p2.Plane = new p2.Plane();
		//创建body刚体
		let planeBody = new p2.Body({
			//刚体类型
			type: p2.Body.STATIC,
			//刚体的位置
			position: [x, y]
		});
		planeBody.angle = angle;
		planeBody.displays = [];
		planeBody.addShape(planeShape);
		this.world.addBody(planeBody);

		return planeBody;
	}

	private basketballBody: p2.Body;
	//贴图显示对象
	private onButtonClick(e: egret.TouchEvent) {
		if (this.hand.hitTestPoint(e.stageX, e.stageY)) {
			this._distance.x = e.stageX - this.hand.x;
			this._distance.y = e.stageY - this.hand.y;
			this.pointGroup.visible = true;
			this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTapMove, this);
		}
	}

	private onTapEnd(e: egret.TouchEvent) {
		this.isRight = false;
		this.hand.touchEnabled = false;
		this.bottomDesk.position = [640, 1140];
		var x = this.hand.x - 452;
		var y = this.hand.y - 742;
		this.isTop = false;
		this.basketballBody.applyForce([-x, -y * 1.5], this.basketballBody.position);
		console.log("-x：" + -x + "-y:" + -y * 1.5);
		egret.Tween.get(this.hand).to({ x: 452, y: 742 }, 200);
		this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTapMove, this);
	}

	private onTapMove(e: egret.TouchEvent) {
		this.hand.x = e.stageX - this._distance.x;
		this.hand.y = e.stageY - this._distance.y;

		var x = this.hand.x - 452;
		var y = this.hand.y - 742;

		// var g = 9.81;
		// var u = Math.sqrt(x * x + y * y); //斜边
		// var a = (Math.PI / 2) - Math.asin(x / u); //角度
		// if (y < 0) { a = -a; }
		// for (let i = 0; i < this.pointGroup.numChildren; i++) {
		// 	var rect = <eui.Rect>this.pointGroup.getChildAt(i);
		// 	var t = (0.5 + i);
		// 	rect.x = u * Math.cos(a) * t;
		// 	rect.y = rect.x * Math.tan(a) - (g * rect.x * rect.x) / (2 * u * u * Math.cos(a) * Math.cos(a));
		// 	rect.x = -rect.x;
		// 	rect.y = -rect.y;
		// }

		var p0 = new egret.Point(this.Basketball.x, this.Basketball.y);
		this.drawParabola(p0, -0.6 * x, -0.6 * (1.5 * y));
	}

	private drawParabola(p0: egret.Point, vx: number, vy: number) {
		for (var i = 0; i < this.pointGroup.numChildren; i++) {
			var rect = <eui.Rect>this.pointGroup.getChildAt(i);
			var second = i;
			var x = p0.x + vx * second;
			var y = p0.y + vy * second + 0.5 * 9.81 * second * second;
			rect.x = x;
			rect.y = y;
		}
	}

	private isTop: boolean = false;
	private seed: number = 2;
	//帧事件，步函数
	private update() {
		this.world.step(60 / 100);
		if (this.BasketFrame1.x <= 30) {
			this.seed = Math.abs(this.seed);
		}
		else if (this.BasketFrame1.x >= 200) {
			this.seed = -Math.abs(this.seed);
		}

		this.BasketFrame1.x = this.BasketFrame2.x += this.seed;
		this.setBasketFrameX();

		var l = this.world.bodies.length;
		for (var i: number = 0; i < l; i++) {
			var boxBody: p2.Body = this.world.bodies[i];
			if (boxBody.displays) {
				var box: egret.DisplayObject = boxBody.displays[0];
				if (box) {
					//将刚体的坐标和角度赋值给显示对象
					box.x = boxBody.position[0];
					box.y = boxBody.position[1];
					box.rotation = boxBody.angle * 180 / Math.PI;
					//如果刚体当前状态为睡眠状态，将图片alpha设为0.5，否则为1
					// if (boxBody.sleepState == p2.Body.SLEEPING) {
					// 	box.alpha = 0.5;
					// 	this.basketballBody.position = [452, 742];
					// }
					// else {
					// 	box.alpha = 1;
					// }
				}
			}
		}

		var _x = this.basketballBody.position[0];
		var _y = this.basketballBody.position[1];
		if (_y + 17.25 <= this.BasketFrame1.y) { 
			this.isTop = true;
		}

		if (this.isTop) {
			let right = _x < (this.BasketFrame1.x + this.BasketFrame1.width + 2.375);
			let left = _x > (this.BasketFrame1.x);
			let top = _y >= (this.BasketFrame1.y) && _y <= (this.BasketFrame1.y + this.BasketFrame1.height);
			if (left && right && top) {
				this.isTop = false;
				this.isRight = true;
			}
		}

		if (_x <= 26 || _x >= 850 || _y >= 982) {
			this.settlement();
		}

		//this.p2Debug.drawDebug();
	}

	private recoveryBall() {
		this.basketballBody.position = [452, 742];
		this.basketballBody.velocity = [0, 0];
		this.bottomDesk.position = [452, 781.5];
		this.hand.touchEnabled = true;
		this.pointGroup.visible = false;
		for (let i = 0; i < this.pointGroup.numChildren; i++) {
			var rect = <eui.Rect>this.pointGroup.getChildAt(i);
			rect.x = 0;
			rect.y = 0;
		}
	}

	private settlement() {
		this.recoveryBall();
		this.answerCount++;
		var score = 0;
		if (this.isRight) {
			score = 3;
		}
		else {
		}
		var data = { subject: 5, score: score, nameCH: "理综" };
		this.scoreList.push(data);
		if (this.answerCount >= 5) {
			egret.setTimeout(() => {
				this.hide();
			}, this, 500);
		}
	}

	protected onhide() {
		this.removeEventListener(egret.Event.ENTER_FRAME, this.update, this);
	}

	/**
 	* 绘制刚体 调试用
 	*/

	private addContactMaterial(body1: p2.Body, body2: p2.Body) {
		var materialA = new p2.Material(1);
		var materialB = new p2.Material(2);
		body1.shapes[0].material = materialA;
		body2.shapes[0].material = materialB;
		let contactMaterial: p2.ContactMaterial = new p2.ContactMaterial(materialA, materialB);
		contactMaterial.restitution = 0.5;
		this.world.addContactMaterial(contactMaterial);
	}
}