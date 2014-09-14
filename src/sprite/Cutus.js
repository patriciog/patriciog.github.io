var Cutus = cc.Sprite.extend({
	active:false,
	currentAnim:"",
	ctor:function () {
		this._super("#hb/hit_01.png");
		this.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
		this.visible = false;
		this.setAnchorPoint(0.5,0);
		this.y = 1;
		// flip? 
		// this.flippedX = false; // By default facing to right
		// this.flippedX = true; // facing to left
		
		this.loadAnimation("hb/walk_", 3, 0.25, "walk", false);
		this.loadAnimation("hb/jump_", 3, 0.75, "jump", true);
		this.loadAnimation("hb/hit_", 3, 0.25, "hit", false);
		this.loadAnimation("hb/push_", 3, 0.25, "push", true);

	},
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
	born:function(pos) {
		this.active=true;
		this.visible=true;
		
		this.x = pos.x;
		this.y = pos.y;
		
		if( this.currentAnim != "hit" ) {
			var hit = cc.animationCache.getAnimation("hit");
			hit.setRestoreOriginalFrame(true);
			
			var animHit = cc.Animate.create(hit);

			this.stopAllActions();
			this.runAction(animHit.repeatForever());
			this.currentAnim = "hit";
		}
	},
	goToTheLeft:function() {
		if(this.active) {
			this.x -= 1;
			this.flippedX = true; // facing to left
		
			if( this.currentAnim != "walk" ) {
				var walk = cc.animationCache.getAnimation("walk");
				walk.setRestoreOriginalFrame(true);
	
				var animWalk = cc.Animate.create(walk);

				this.stopAllActions();
				this.runAction(animWalk.repeatForever());
				this.currentAnim = "walk";
			}
			
		}
	},
	goToTheRight:function() {
		if(this.active) {
			this.x += 1;
			this.flippedX = false; // By default facing to right

			if( this.currentAnim != "walk" ) {
				var walk = cc.animationCache.getAnimation("walk");
				walk.setRestoreOriginalFrame(true);
	
				var animWalk = cc.Animate.create(walk);
	
				this.stopAllActions();
				this.runAction(animWalk.repeatForever());
				this.currentAnim = "walk";
			}
		}
	},
	jumpLeft:function() {
		var direction = cc.p(-100, 0);
		this.jump(direction);
		this.flippedX = true; // facing to left
	},
	jumpRight:function() {
		var direction = cc.p(100, 0);
		this.jump(direction);
		this.flippedX = false; // By default facing to right
	},
	jump:function(direction) {
		if(this.active) {
			
			this.active = false;
			
			var jump = cc.animationCache.getAnimation("jump");
			jump.setRestoreOriginalFrame(true);

			var animJump = cc.Animate.create(jump);

			this.stopAllActions();

			this.runAction( animJump );

			this.currentAnim = "jump";

			var repeatNumber = 1;
			var verticalReach = 25;

			var actionJump =  cc.sequence(
					cc.jumpBy(2, direction, verticalReach, repeatNumber),
					cc.callFunc(this.onLanding, this)
			);

			this.runAction( actionJump );
		}
	},
	onLanding:function(){
		this.active = true;
	},
	collideRect:function (x, y) {
		var w = this.width;
		var h = this.height;
		return cc.rect(x - w / 2, y, w, h);
	}
});