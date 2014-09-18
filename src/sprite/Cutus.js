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

/** <p>Cutus class represent the heroine character of our history. <br/>
 * </p>
 *
 * <p>The main features of Cutus are: <br/>
 * - It executes/loads actions/animations: go to the right, go to the left and jump. <br/>
 * - It checks collisions with points. <br/>
 *
 * @class
 * @extends cc.Sprite
 *
 * @property {Boolean}               active       	- If the user can interact or not
 * @property {Boolean}               isJumping      - If she's in the air now or not
 * 
 */
var Cutus = cc.Sprite.extend({

	// Public variables
	active:false,
	isJumping:false,

	// Private variables
	_currentAnim:"",

	/**
	 * <p>Default constructor.<br/>
	 * </p>
	 * @function
	 */
	ctor:function () {
		this._super("#hb/hit_01.png");
		if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
			// It doesn't work with Canvas
			this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
		}
		this.visible = false;
		this.setAnchorPoint(0.5,0);
		this.y = 1;
		// flip? 
		this.flippedX = false; // By default facing to right
		
		this.loadAnimation("hb/walk_", 3, 0.25, "walk", false);
		this.loadAnimation("hb/jump_", 3, 0.75, "jump", true);
		this.loadAnimation("hb/hit_", 3, 0.25, "hit", false);
		this.loadAnimation("hb/push_", 3, 0.25, "push", true);

	},
	
	/**
	 * <p>Loads all SpriteFrames of an animation.<br/>
	 * </p>
	 * @function
	 * @param {String}              preffix       	- Preffix of the SpriteFrames.
	 * @param {Number}              numberOfFrames  - Max number of SpriteFrames.
	 * @param {Number}              delay      		- Delay between SpriteFrames.
	 * @param {String}              name      		- Name of the animation.
	 * @param {Boolean}             isComplete     	- If not isComplete then it duplicate the SpriteFrames inversely.
	 */
	loadAnimation:function(preffix, numberOfFrames, delay, name, isComplete){
		var frame;
		var animFrames = [];
		var animation;
		for (var i = 1; i <= 3; i++) {
			str = preffix + (i < 10 ? ("0" + i) : i) + ".png";
			frame = cc.spriteFrameCache.getSpriteFrame(str);
			animFrames.push(frame);
		}
		if(!isComplete)
		{
			// Complete with duplicate frames on reverse
			for (var i = 3; i >= 1; i--) {
				str = preffix + (i < 10 ? ("0" + i) : i) + ".png";
				frame = cc.spriteFrameCache.getSpriteFrame(str);
				animFrames.push(frame);
			}
		}
		var animation = new cc.Animation(animFrames, delay);
		cc.animationCache.addAnimation(animation, name);
	},
	
	/**
	 * <p>Only for testing.<br/>
	 * </p>
	 */
	testAnimations:function() {
		// revive effect
		var hit = cc.animationCache.getAnimation("hit");
		hit.setRestoreOriginalFrame(true);
		var walk = cc.animationCache.getAnimation("walk");
		walk.setRestoreOriginalFrame(true);
		var jump = cc.animationCache.getAnimation("jump");
		jump.setRestoreOriginalFrame(true);
		var push = cc.animationCache.getAnimation("push");
		push.setRestoreOriginalFrame(true);
		
		var animHit = cc.Animate.create(hit);
		var animWalk = cc.Animate.create(walk);
		var animJump = cc.Animate.create(jump);
		var animPush = cc.Animate.create(push);
		
		var seq = cc.Sequence.create(animHit, animWalk, animJump, animPush);

		this.runAction(seq.repeatForever());
	},
	
	/**
	 * <p>Shows our heroine initially in a place.<br/>
	 * </p>
	 */
	born:function(pos) {
		this.active=true;
		this.visible=true;
		
		this.x = pos.x;
		this.y = pos.y;
		
		if( this._currentAnim != "hit" ) {
			var hit = cc.animationCache.getAnimation("hit");
			hit.setRestoreOriginalFrame(true);
			
			var animHit = cc.Animate.create(hit);

			this.stopAllActions();
			this.runAction(animHit.repeatForever());
			this._currentAnim = "hit";
		}
	},
	
	/**
	 * <p>Executes go to the left and appropiate animation.<br/>
	 * </p>
	 */
	goToTheLeft:function() {
		if(this.active) {
			this.x -= 1;
			this.flippedX = true; // facing to left
		
			if( this._currentAnim != "walk" ) {
				var walk = cc.animationCache.getAnimation("walk");
				walk.setRestoreOriginalFrame(true);
	
				var animWalk = cc.Animate.create(walk);

				this.stopAllActions();
				this.runAction(animWalk.repeatForever());
				this._currentAnim = "walk";
			}
			
		}
	},
	
	/**
	 * <p>Executes go to the right and appropiate animation.<br/>
	 * </p>
	 */
	goToTheRight:function() {
		if(this.active) {
			this.x += 1;
			this.flippedX = false; // By default facing to right

			if( this._currentAnim != "walk" ) {
				var walk = cc.animationCache.getAnimation("walk");
				walk.setRestoreOriginalFrame(true);
	
				var animWalk = cc.Animate.create(walk);
	
				this.stopAllActions();
				this.runAction(animWalk.repeatForever());
				this._currentAnim = "walk";
			}
		}
	},
	
	/**
	 * <p>Executes jump left and appropiate animation.<br/>
	 * </p>
	 */
	jumpLeft:function() {

		cc.log("cutus.jumpLeft");
		
		var direction = cc.p(-100, 0);
		this.jump(direction);
		this.flippedX = true; // facing to left
	},
	
	/**
	 * <p>Executes jump left and appropiate animation.<br/>
	 * </p>
	 */
	jumpRight:function() {
		
		cc.log("cutus.jumpRight");
		
		var direction = cc.p(100, 0);
		this.jump(direction);
		this.flippedX = false; // By default facing to right
	},
	
	/**
	 * <p>Executes jump and appropiate animation.<br/>
	 * </p>
	 * @param {cc.p}             direction     	- Direction of jump
	 */
	jump:function(direction) {
		if(this.active) {
			
			cc.log("cutus.jump");
			
			this.isJumping = true;
			
			var jump = cc.animationCache.getAnimation("jump");
			jump.setRestoreOriginalFrame(true);

			var animJump = cc.Animate.create(jump);

			this.stopAllActions();

			this.runAction( animJump );

			this._currentAnim = "jump";

			var repeatNumber = 1;
			var verticalReach = 25;

			var actionJump =  cc.sequence(
					cc.jumpBy(2, direction, verticalReach, repeatNumber),
					cc.callFunc(this.onLandingClbk, this)
			);

			this.runAction( actionJump );
		}
	},
	
	/**
	 * <p>Callback method called when jump finish.<br/>
	 * </p>
	 */
	onLandingClbk:function(){
		this.isJumping = false;
	},
	
	/**
	 * <p>Checks if she collides with a point.<br/>
	 * </p>
	 * @param {Number}             x     	- x value of the point
	 * @param {Number}             y     	- y value of the point
	 * @return {Boolean}
	 */
	collideRect:function (x, y) {
		var w = this.width;
		var h = this.height;
		return cc.rect(x - w / 2, y, w, h);
	}
});