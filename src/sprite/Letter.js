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

/** <p>Letter class represent a letter. <br/>
 * </p>
 *
 * <p>The main features of Letter are: <br/>
 * - It executes/loads actions/animations: go to the right, go to the left and jump. <br/>
 * - It checks collisions with points. <br/>
 *
 * @class
 * @extends cc.Sprite
 *
 * @property {Boolean}               active       	- If the letter was touched by the heroine
 * 
 */
var Letter = cc.Sprite.extend({
	
	// Public variables
	active:false,
	
	// Private variables
	_letterType:null,
	_soundEffect:null,
	
	/**
	 * <p>Default constructor.<br/>
	 * </p>
	 * @function
	 * @param {LetterType}             arg     	- Type of the letter
	 */
	ctor:function(arg){
		this._super("#"+arg.textureName);
		this._letterType=arg.type;
		this._soundEffect=arg.soundEffect;
		// this.setAnchorPoint(0.5,0);
		// this.anchorPointY=0; ==> Not is the same, use setAnchorPoint always
		this.setAnchorPoint(0.5,0);
		this.visible = false;
	},
	
	/**
	 * <p>Shows a letter initially.<br/>
	 * </p>
	 * @function
	 */
	born:function(){
		
		this.active = true;
		this.visible = true;
		
		var fadeIn = cc.FadeIn.create(HB.LETTER_DURATION);
		var moveBy = cc.MoveBy.create(HB.LETTER_DURATION, cc.p(0, 80));
		var move_ease_out = moveBy.clone().easing(cc.easeOut(2.0));

		var action = cc.Spawn.create(fadeIn, move_ease_out);

		this.runAction(action);
		
		if( HB.AUDIO.ENABLED ) {
			cc.audioEngine.setMusicVolume(HB.AUDIO.SOUND_FX);
			cc.audioEngine.playEffect(this._soundEffect);
		}
		
		HB.ACTIVE_LETTERS++;
		
	},
	
	/**
	 * <p>Checks if it collides with a point.<br/>
	 * </p>
	 * @function
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

/**
 * <p>Create a type of letter an return it.<br/>
 * </p>
 * @function
 * @param {LetterType}             arg     	- Type of the letter
 * @return {Letter}
 */
Letter.create = function (arg) {
	var letter = new Letter(arg);
	g_sharedAppLayer.addLetter(letter, HB.UNIT_TAG.LETTER);
	HB.CONTAINER.LETTERS.push(letter);
	return letter;
};