var SleepLayer = cc.Layer.extend({
	ctor:function(){
		this._super();
		this.init();
	},
	init:function () {
		var draw = new cc.DrawNode();

		draw.drawSegment(cc.p(0, 0), cc.p(size.width, size.height), 1, cc.color(255, 255, 255, 255));
		this.addChild(draw, 10);
	}
});
