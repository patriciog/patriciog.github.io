var Container = cc.Sprite.extend({
	_emitter:null,
	_fallDuration:7.5,
	ctor:function(){
		this._super("#hb/container.png");
		this.setAnchorPoint(0.5,1); 
		// Modify position like anchor point (0,0) but it isn't modify
		this.ignoreAnchorPointForPosition(true);
		// Outside top screen
		var curPos = cc.p(Math.random()*cc.winSize.width, cc.winSize.height);
		curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(cc.winSize.width, cc.winSize.height + this.getContentSize().height));
		this.setPosition(curPos);
		this.rotation=45;
	},
	born:function(){
		
		var maxDuration = 3;
		var minDuration = 2;
		
		var rangeDuration = maxDuration - minDuration;
		var actualDuration = ( Math.random() % rangeDuration ) + minDuration;
		
		var rotateTo = cc.rotateBy(actualDuration, -90);
		var rotate_ease_out = rotateTo.clone().easing(cc.easeSineInOut());
		
		rangeDuration = maxDuration - minDuration;
		actualDuration = ( Math.random() % rangeDuration ) + minDuration;
		
		var rotateToBack = cc.rotateBy(actualDuration, 90);
		var rotateBack_ease_out = rotateToBack.clone().easing(cc.easeSineInOut());
		
		this.runAction(cc.sequence(rotate_ease_out, rotateBack_ease_out).repeatForever());
		
		// Container has to go from outside top screen to floor
		var distance = cc.winSize.height - FLOOR_POSITION_Y;
		
		var moveBy = cc.MoveBy.create(this._fallDuration, cc.p(0, distance * (-1) ));
		var move_ease_out = moveBy.clone().easing(cc.easeOut(2.5));

		var sequence = cc.sequence(move_ease_out, cc.callFunc(this.onLanding, this));
		
		this.runAction(sequence);
		
	}
});

Container.prototype.onLanding = function() {
	g_sharedGameLayer.addEmitter(cc.p(this.x + this.getContentSize().width/2, this.y));
};