var Letter = cc.Sprite.extend({
	active:false,
	letterType:0,
	ctor:function(arg){
		this._super("#"+arg.textureName);
		this.letterType=arg.type;
		// this.setAnchorPoint(0.5,0);
		// this.anchorPointY=0; ==> Not is the same, use setAnchorPoint always
		this.setAnchorPoint(0.5,0);
		this.visible = false;
	},
	born:function(){
		
		this.active = true;
		this.visible = true;
		
		var fadeIn = cc.FadeIn.create(1.0);
		var moveBy = cc.MoveBy.create(1, cc.p(0, 80));
		var move_ease_out = moveBy.clone().easing(cc.easeOut(2.0));

		var action = cc.Spawn.create(fadeIn, move_ease_out);

		this.runAction(action);
	},
	collideRect:function (x, y) {
		var w = this.width;
		var h = this.height;
		return cc.rect(x - w / 2, y, w, h);
	}
});

Letter.create = function (arg) {
	var letter = new Letter(arg);
	g_sharedGameLayer.addLetter(letter, HB.UNIT_TAG.LETTER);
	HB.CONTAINER.LETTERS.push(letter);
	HB.ACTIVE_LETTERS++;
	return letter;
};