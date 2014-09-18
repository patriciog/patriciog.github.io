/**
 *  Cocos2d-js show case : Happy Birthday
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 * @Authors:
 * Programmer: Patricio González Sevilla
 *
 */

/** <p>Container class represent the apparatus which the heroine is transported. <br/>
 * </p>
 *
 * <p>The main features of Container are: <br/>
 * - It shows top of the screen and drops to the floor. <br/>
 * - Change state of the game from "Sleep" to "Play" when it's landed. <br/>
 *
 * @class
 * @extends cc.Sprite
 * 
 */
var Container = cc.Sprite.extend({
	
	// Private variables
	_fallDuration:1,	// 31.25,
	
	/**
	 * <p>Default constructor.<br/>
	 * </p>
	 * @function
	 */
	ctor:function(){
		this._super("#hb/container.png");
		this.setAnchorPoint(0.5,1); 
		// Modify position like anchor point (0,0) but it isn't modify
		this.ignoreAnchorPointForPosition(true);
		// Outside top screen
		var curPos = cc.p(Math.random()*cc.winSize.width, cc.winSize.height);
		curPos = cc.pClamp(curPos, cc.p(0, 0), cc.p(cc.winSize.width - this.getContentSize().width, cc.winSize.height + this.getContentSize().height));
		this.setPosition(curPos);
		this.rotation=45;
	},
	
	/**
	 * <p>Method called when appears into the scene.<br/>
	 * </p>
	 * @function
	 */
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
		var distance = cc.winSize.height - HB.FLOOR.POSITION_Y;
		
		var moveBy = cc.MoveBy.create(this._fallDuration, cc.p(0, distance * (-1) ));
		var move_ease_out = moveBy.clone().easing(cc.easeOut(2.5));

		var sequence = cc.sequence(move_ease_out, cc.callFunc(this.onLandingClbk, this));
		
		this.runAction(sequence);
		
	}
});

/**
 * <p>Callback method called when container has landed.<br/>
 * </p>
 * @function
 */
Container.prototype.onLandingClbk = function() {
	g_sharedAppLayer.state = HB.GAME_STATE.PLAY;
	g_sharedAppLayer.addEmitter(cc.p(this.x + this.getContentSize().width/2, this.y));
};