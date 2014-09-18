/**
 * <p>
 * Cocos2d-js show case : Happy Birthday. <br/>
 * </p>
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 * @Authors:
 * Programmer: Patricio González Sevilla
 */

//Global reference to AppLayer
var g_sharedAppLayer = null;

/** <p>AppLayer is the principal layer and the only one. <br/>
 * </p>
 *
 * <p>The main features of AppLayer are: <br/>
 * - It keeps state of the game. "Sleep" at the begining and "Play" <br/>
 * when Container lands. <br/>
 * - It's a GradientLayer then simulate a Sky. <br/>
 * - It contains SpriteBatchNode (Heroine, Letters, floor and container) and <br/>
 * Particle System emitter. <br/>
 * - If state is "Play" it evaluates completion condition <br/>
 * - If state is "Play" it evaluates collide between heroine and letters <br/>
 * - If state is "Play" it process keyboard <br/></p>
 *
 * @class
 * @extends cc.LayerGradient
 *
 * @property {Number}               state       	- The state of the game
 * 
 */
var AppLayer = cc.LayerGradient.extend({
	
	// Public variables
	state:HB.GAME_STATE.SLEEP, 
    
	// Private variables
	_cutus:null,
    _texHappyBirthdayBatch:null,
    _container:null,
    _emitter:null,
    _isComplete:false,
    _initialVolume:0.0,
    _targetVolume:HB.AUDIO.MUSIC,
    
    /**
     * <p>Default constructor.<br/>
     * </p>
     * @function
     * @returns {boolean} Whether the initialization was successful.
     */
    ctor:function () {
        
    	// Variables to simulate day and night
    	var topColorDay = cc.color(255,255,255,255);
    	var topColorNight = cc.color(0,0,0,255);
    	var max = 1.0;
    	var min = 0.0;
    	var range = max - min;
    	// Also accepts hexadecimal values!
    	var bottomColorSoftBlue = cc.color(0x46,0x82,0xB4,255);
    	
    	// Simulates the sky day and night aleatory
    	this._super(
    		( ( cc.rand() % range ) < 0.5 ? topColorDay : topColorNight ),
    		bottomColorSoftBlue
    	);
    	
    	// Creates a larger content size to avoid displaying black space
    	// when we use a pursuit camera at the begining
    	this.setContentSize(cc.winSize.width,cc.winSize.height*1.5);

    	// Initializes the global shared reference
        g_sharedAppLayer = this;
        
        // Preloads spritesheet into cache and the textures will be available
        // from our scene
        cc.spriteFrameCache.addSpriteFrames(res.HappyBirthday_plist);
        var texHappyBirthday = cc.textureCache.addImage(res.HappyBirthday_png);
        this._texHappyBirthdayBatch = new cc.SpriteBatchNode(texHappyBirthday);
        this.addChild(this._texHappyBirthdayBatch);
        
        // All of the above statements have been executed correctly
        return true;
        
    },
    
    /**
     * <p>Overrides onEnter method. <br/>
     * Event callback that is invoked every time when CCNode enters the 'stage'. <br/>
     * If the CCNode enters the 'stage' with a transition, this event is called <br/>
     * when the transition starts. <br/>
     * During onEnter you can't access a "sister/brother" node. <br/>
     * </p>
     * @function
     */
    onEnter: function () {
    	
    	// If you override onEnter, you must call its parent's onEnter function
    	// with this._super().
    	this._super();
    	
    	// Creates the heroine and adds to the SpriteBatchNode
    	this._cutus = new Cutus();
    	this._texHappyBirthdayBatch.addChild(this._cutus, HB.ZORDER.CHARACTER);

    	// Creates the letters from Level and adds to the SpriteBatchNode
    	var letter;
    	var xOffset = 100;
		var selLetters = Level.letters[0];
		if(selLetters){
			for(var currentLetter = 0; currentLetter < Level.letters[0].Types.length; currentLetter++ ){
			
				for(var currentType = 0; currentType < LetterType.length; currentType++ ){
					
					if( Level.letters[0].Types[currentLetter] == LetterType[currentType].type ){
						
						var letterTypeParse = LetterType[LetterType[currentType].id];
						if(letterTypeParse.textureName!=""){
							letter = Letter.create(letterTypeParse);
							// Sets the positionY equals to the floor
							letter.setPosition(xOffset, HB.FLOOR.POSITION_Y);
						}
						// Sets the positionX +50
						xOffset=xOffset+50;
						continue;
						
					}
					
				}
				
			}
		}

    	// Creates the container and adds to the SpriteBatchNode
    	this._container = new Container();
    	this._texHappyBirthdayBatch.addChild(this._container);

    	// Creates the floor (duplicate image) and adds to the SpriteBatchNode
    	var floorPart;
    	var xOffset=0;
    	for(var i = 0; i < 3;i++ ){
    		floorPart = new cc.Sprite("#hb/floor.png");
    		floorPart.setPosition(xOffset, HB.FLOOR.POSITION_Y);
    		floorPart.setAnchorPoint(0, 0);
    		this._texHappyBirthdayBatch.addChild(floorPart, HB.ZORDER.GROUND);
    		xOffset=xOffset + floorPart.getContentSize().width  - HB.FLOOR.FIT;
    	}

    	// Registry a EventListener for keyboard input events for this layer 
    	if( cc.sys.platform == cc.sys.DESKTOP_BROWSER && 'keyboard' in cc.sys.capabilities ) {
    		cc.eventManager.addListener({
    			event: cc.EventListener.KEYBOARD,
    			onKeyPressed:function(key, event) {

    				// Register pressed keyboard activity
    				if ( key == cc.KEY.a || key == cc.KEY.w || key == cc.KEY.d ||
    						key == cc.KEY.left || key == cc.KEY.up || key == cc.KEY.right ) {

    					// Enabled into the array
    					HB.PRESSED_KEYS[key] = true;

    				}

    			},
    			onKeyReleased:function(key, event) {

    				// Disabled into the array
    				HB.PRESSED_KEYS[key] = false;

    			}
    		}, this);	
    	}
    	
    	// Mute volume
    	cc.audioEngine.setMusicVolume(0.0);
    	cc.audioEngine.setEffectsVolume(0.0);
    	
    },
    
    /**
     * <p>Overrides onEnterTransitionDidFinish method. <br/>
     * Event callback that is invoked when the CCNode enters in the 'stage'. <br/>
     * If the CCNode enters the 'stage' with a transition, this event is called
     * when the transition finishes. <br/>
     * </p>
     * @function
     */ 
    onEnterTransitionDidFinish: function () {
    	
    	// If you override onEnterTransitionDidFinish, you must call its parent's
    	// onEnter function with this._super().
    	this._super();

    	// Audio management
    	if (HB.AUDIO.ENABLED) {
    		// Plays background music
    		cc.audioEngine.playMusic(res.bgMusic_mp3, true);
    		// Sets volume
    		cc.audioEngine.setMusicVolume(this._initialVolume);
    		cc.audioEngine.setEffectsVolume(HB.AUDIO.SOUND_FX);
    	}

    	// Drops the container
    	this._container.born();
    	// Pursuits the camera
    	this.runAction(cc.follow(this._container, cc.rect(0, 0, cc.winSize.width, cc.winSize.height + this.getContentSize().height)));

    	// Policy of scheduleUpdate:
    	// - This method will be called every frame.
    	// - It will use the order number 0 (Scheduled methods with a lower
    	// order value will be called before the ones that have a higher order
    	// value.)
    	// - Only one "update" method could be scheduled per node.
    	this.scheduleUpdate();
    	
    },
    
    /**
     * <p>Overrides update method to implement my update logic. <br/>
     * Update will be called automatically every frame if "scheduleUpdate" is <br/>
     * called when the node is "live". <br/>
     * </p>
     * @function
     * @param {Number} dt Delta time since last update
     */ 
	update:function (dt) {
		
		// Only when container has landed
		if (this.state == HB.GAME_STATE.PLAY) {
			// Victory condition checking
			if(!this._isComplete) {
				this.checkGameCondition();
			}
			// Waths the collisions
			this.checkIsCollide();
			// Process the input
			this.processKeyboardInput();
		}
		
		if (HB.AUDIO.ENABLED) {
			// Fade-in music
			if( cc.audioEngine.getMusicVolume() < this._targetVolume ) {
				cc.audioEngine.setMusicVolume(cc.audioEngine.getMusicVolume()+0.001);
			}
		}
		
	},
	
	/**
	 * <p>Method to test victory condition. <br/>
	 * </p>
	 * @function
	 */
	checkGameCondition:function() {
		
		if( HB.ACTIVE_LETTERS < HB.CONTAINER.LETTERS.length ) {
			return;
		}
		
		var delay = HB.LETTER_DURATION * 3;
		this.scheduleOnce(this.sequenceCompleteClbk, delay);
		
	},
	
	/**
	 * <p>Callback method called when victory condition is reached. <br/>
	 * </p>
	 * @function
	 */
	sequenceCompleteClbk:function() {
		
		cc.audioEngine.setEffectsVolume(1.0);
		cc.audioEngine.playEffect(res.realization_mp3);

		this._isComplete = true;

		this.removeChild(this._emitter);

		this._emitter = new cc.ParticleFireworks();
		// Limits number of particles on mobile browsers
		if( cc.sys.platform == cc.sys.MOBILE_BROWSER ) {
			this._emitter.setTotalParticles(15);
		}
		this._emitter.texture = cc.textureCache.addImage(res.Particle_png);
		this._emitter.x = cc.winSize.width / 2;
		this._emitter.y = cc.winSize.height / 2;
		this.addChild(this._emitter);
	},
	
	/**
	 * <p>Method to check collision between the heroine and the letters. <br/>
	 * </p>
	 * @function
	 */
	checkIsCollide:function () {
		var selLetter;
		// check collide
		for (var i = 0; i < HB.CONTAINER.LETTERS.length; i++) {
			
			selLetter = HB.CONTAINER.LETTERS[i];
			
			// Ignore if active
			if (selLetter.active)
				continue;
			
			if (this.collide(this._cutus, selLetter)) {
				if (this._cutus.active && !selLetter.active) {
					selLetter.born();
				}
			}
		}
	},
	
	/**
	 * <p>Method to check collision between the heroine and a letter. <br/>
	 * </p>
	 * @function
	 * @param {Cutus}             a     	- Heroine
	 * @param {Letter}            b     	- Letter
	 * @return {Boolean}
	 */
	collide:function (a, b) {
		var ax = a.x, ay = a.y, bx = b.x, by = b.y;

		var aRect = a.collideRect(ax, ay);
		var bRect = b.collideRect(bx, by);
		return cc.rectIntersectsRect(aRect, bRect);
	},
	
	/**
	 * <p>Callback method called when the particles are evaporated. <br/>
	 * </p>
	 * @function
	 */
	onSplashParticlesEndingClbk:function(nodeExecutingAction, pos) {
		this._cutus.born(pos);
	},
	
	/**
	 * <p>Method to process all keys pressed. <br/>
	 * </p>
	 * @function
	 */
	processKeyboardInput:function(){
		if( g_sharedAppLayer._cutus.active && !g_sharedAppLayer._cutus.isJumping ) {
			if( ( HB.PRESSED_KEYS[cc.KEY.a] || HB.PRESSED_KEYS[cc.KEY.left] ) &&
					( !HB.PRESSED_KEYS[cc.KEY.a] || !HB.PRESSED_KEYS[cc.KEY.left] ) ) {
				if ( HB.PRESSED_KEYS[cc.KEY.w] || HB.PRESSED_KEYS[cc.KEY.up] ) {
					// Left + Jump
					g_sharedAppLayer._cutus.jumpLeft();
				}
				else {
					// Left
					g_sharedAppLayer._cutus.goToTheLeft();
				}
			}
			else if( ( HB.PRESSED_KEYS[cc.KEY.d] || HB.PRESSED_KEYS[cc.KEY.right] ) &&
					( !HB.PRESSED_KEYS[cc.KEY.a] || !HB.PRESSED_KEYS[cc.KEY.left] ) ) {
				if ( HB.PRESSED_KEYS[cc.KEY.w] || HB.PRESSED_KEYS[cc.KEY.up] ) {
					// Right + Jump
					g_sharedAppLayer._cutus.jumpRight();
				}
				else {
					// Right
					g_sharedAppLayer._cutus.goToTheRight();
				}
			}
			else if ( HB.PRESSED_KEYS[cc.KEY.w] || HB.PRESSED_KEYS[cc.KEY.up] ) {
				// Jump
				g_sharedAppLayer._cutus.jump(cc.p(0,0));
			}
		}
	}
});

/**
 * <p>Method to add a letter to current SpriteBatchNode. <br/>
 * </p>
 * @function
 * @param {Letter}		letter		- Letter to add
 * @param {tag}			tag			- Unit tag
 */
AppLayer.prototype.addLetter = function (letter, tag) {
	// To take advantage of SpriteBatch
	this._texHappyBirthdayBatch.addChild(letter, HB.ZORDER.LETTER, tag);
};

/**
 * <p>Method to add a ParticleSystem to current SpriteBatchNode. <br/>
 * </p>
 * @function
 * @param {cc.p}		pos		- Point to place the emitter
 */
AppLayer.prototype.addEmitter = function (pos) {
	// To take advantage of SpriteBatch
	var emitterDuration = 2.5;
	
	this._emitter = new cc.ParticleFlower();
	this._emitter.duration = emitterDuration;
	// Limits number of particles on mobile browsers
	if( cc.sys.platform == cc.sys.MOBILE_BROWSER ) {
		this._emitter.setTotalParticles(5);
	}
	else {
		this._emitter.setTotalParticles(15);
	}
	this._emitter.texture = cc.textureCache.addImage(res.Particle_png);
	this._emitter.x = pos.x;
	this._emitter.y = pos.y;
	this._texHappyBirthdayBatch.removeChild(this._container);
	this.addChild(this._emitter);
	
	var seq = cc.sequence(
			cc.delayTime(emitterDuration),
			cc.callFunc(this.onSplashParticlesEndingClbk, this, pos)
	);
	
	this.runAction(seq);
	
};

/**
 * <p>Class represents principal scene. <br/>
 * </p>
 * @class
 * @extends cc.Scene
 */
var AppScene = cc.Scene.extend({
	
	/**
	 * <p>Overrides onEnter method. <br/>
	 * @function
	 */
    onEnter:function () {
    	
    	// If you override onEnter, you must call its parent's onEnter function
    	// with this._super().
    	this._super();
    	
    	// Adds the principal layer to the scene.
    	var appLayer = new AppLayer();
    	this.addChild(appLayer);
    	
    }

});

