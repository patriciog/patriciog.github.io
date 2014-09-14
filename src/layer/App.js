
// Constants
LETTER_ZORDER=-10;
GROUND_ZORDER=-9
CHARACTER_ZORDER=-8;

FLOOR_POSITION_Y=50;
FLOOR_ADJUST=3;

MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;


var g_sharedGameLayer;

var SysMenuLayer = cc.LayerGradient.extend({ // cc.Layer.extend({  
    _cutus:null,
    _texHappyBirthdayBatch:null,
    _state:HB.GAME_STATE.PLAY,
    _container:null,
    _emitter:null,
    _isComplete:false,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
    	// this._super(cc.color(255, 255, 255, 128), cc.winSize.width * 2, cc.winSize.height * 2);
    	this._super(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));
    	this.setContentSize(cc.winSize.width,cc.winSize.height*1.5);

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        g_sharedGameLayer = this;

        this.setColor(cc.color(255, 255, 255));
        
        // Preloads textures into cache and they will be available from our scene
        cc.spriteFrameCache.addSpriteFrames(res.HappyBirthday_plist);

        // HappyBirthdayBatch ( Sprite added to batch == CallDraw )
        var texHappyBirthday = cc.textureCache.addImage(res.HappyBirthday_png);
        this._texHappyBirthdayBatch = new cc.SpriteBatchNode(texHappyBirthday);
        this.addChild(this._texHappyBirthdayBatch);
        
        this._cutus = new Cutus();
        this._texHappyBirthdayBatch.addChild(this._cutus, CHARACTER_ZORDER);

        var letter;
        var xOffset = 100;
        for(var i = 0; i< Level.letters.length; i++){
        	var selLetter = Level.letters[i];
        	if(selLetter){
        		for(var tIndex = 0; tIndex < selLetter.Types.length;tIndex++ ){
        			var letterTypeParse = LetterType[selLetter.Types[tIndex]];
        			if(letterTypeParse.textureName!=""){
        				letter = Letter.create(letterTypeParse);
        				letter.setPosition(xOffset, FLOOR_POSITION_Y);
        			}
        			xOffset=xOffset+50;
        		}
        	}
        }
        
        this._container = new Container();
        this._texHappyBirthdayBatch.addChild(this._container);
        this._container.born();
        this.runAction(cc.follow(this._container, cc.rect(0, 0, cc.winSize.width, cc.winSize.height + this.getContentSize().height)));
        
        var floorPart;
        var xOffset=0;
        for(var i = 0; i < 3;i++ ){
        	floorPart = new cc.Sprite("#hb/floor.png");
        	floorPart.setPosition(xOffset, FLOOR_POSITION_Y);
        	floorPart.setAnchorPoint(0, 0);
        	this._texHappyBirthdayBatch.addChild(floorPart, GROUND_ZORDER);
        	xOffset=xOffset + floorPart.getContentSize().width  - FLOOR_ADJUST;
        }
        
        // Add input to the layer
        if( cc.sys.platform == cc.sys.DESKTOP_BROWSER && 'keyboard' in cc.sys.capabilities ) {
        	cc.eventManager.addListener({
        		event: cc.EventListener.KEYBOARD,
        		onKeyPressed:function(key, event) {
        			// GAME.KEYS[event] = true;
        			
        			if( g_sharedGameLayer._cutus.active && ( key == cc.KEY.a || key == cc.KEY.w || key == cc.KEY.d ||
        					key == cc.KEY.left || key == cc.KEY.up || key == cc.KEY.right ) ) {
        				
        				// Adds to the array
        				HB.PRESSED_KEYS[key] = true;
        				
        			}
        			
        		},
        		onKeyReleased:function(key, event) {
        			// Remove from the array
        			HB.PRESSED_KEYS[key] = false;
        		}
        	}, this);	
        }
        
        // schedule
        this.scheduleUpdate();

        /* this.letter = new Letter("#hb/exclamation_mark.png");
        this.letter.setPosition(size.width, size.height / 3);
        this._texHappyBirthdayBatch.addChild(this.letter);
        
        // add a "close" icon to exit the progress. it's an autorelease object
        /* var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );
        helloLabel.runAction(
            cc.spawn(
                cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        ); */
        
        return true;
    },
	update:function (dt) {
		if (this._state == HB.GAME_STATE.PLAY) {
			if(!this._isComplete) {
				this.checkGameCondition();
			}
			this.checkIsCollide();
			// this.checkIsReborn();
			// this.updateUI();
			// this._movingBackground(dt);
			this.processKeyboardInput();
		}
	},
	checkGameCondition:function() {
		for( var i = 0; i < HB.CONTAINER.LETTERS.length; i++ ) {
			if(!HB.CONTAINER.LETTERS[i].active)
				return;
		}

		this._isComplete = true;
		
		this.removeChild(this._emitter);
		
		this._emitter = new cc.ParticleFireworks();
		//this._emitter.duration = -1;
		//this._emitter.setTotalParticles(1);
		this._emitter.texture = cc.textureCache.addImage(res.Stars_png);
		this._emitter.x = cc.winSize.width / 2;
		this._emitter.y = cc.winSize.height / 2;
		//if (firework01.setShapeType)
		//	firework01.setShapeType(cc.ParticleSystem.STAR_SHAPE);
		this.addChild(this._emitter);

		/*var firework02 = new cc.ParticleFireworks();
		firework02.duration = -1;
		firework02.setTotalParticles(10);
		firework02.texture = cc.textureCache.addImage(res.Stars_png);
		firework02.x = HB.CONTAINER.LETTERS[HB.CONTAINER.LETTERS.length-1].x;
		firework02.y = HB.CONTAINER.LETTERS[HB.CONTAINER.LETTERS.length-1].y;
		//if (firework02.setShapeType)
		//	firework02.setShapeType(cc.ParticleSystem.STAR_SHAPE);
		this.addChild(firework02); */
		
	},
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
	collide:function (a, b) {
		var ax = a.x, ay = a.y, bx = b.x, by = b.y;
		// if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
		//	return false;

		var aRect = a.collideRect(ax, ay);
		var bRect = b.collideRect(bx, by);
		return cc.rectIntersectsRect(aRect, bRect);
	},
	onSplashParticlesEnding:function(nodeExecutingAction, pos) {
		this._cutus.born(pos);
		
	},
	processKeyboardInput:function(){
		if( ( HB.PRESSED_KEYS[cc.KEY.a] || HB.PRESSED_KEYS[cc.KEY.left] ) ) {
			if ( HB.PRESSED_KEYS[cc.KEY.w] || HB.PRESSED_KEYS[cc.KEY.up] ) {
				g_sharedGameLayer._cutus.jumpLeft();
			}
			else {
				g_sharedGameLayer._cutus.goToTheLeft();
			}
		}
		else if( ( HB.PRESSED_KEYS[cc.KEY.d] || HB.PRESSED_KEYS[cc.KEY.right] ) ) {
			if ( HB.PRESSED_KEYS[cc.KEY.w] || HB.PRESSED_KEYS[cc.KEY.up] ) {
				g_sharedGameLayer._cutus.jumpRight();
			}
			else {
				g_sharedGameLayer._cutus.goToTheRight();
			}
		}
	}
});

SysMenuLayer.prototype.addLetter = function (letter, tag) {
	// To take advantage of SpriteBatch
	this._texHappyBirthdayBatch.addChild(letter, LETTER_ZORDER, tag);
};

SysMenuLayer.prototype.addEmitter = function (pos) {
	// To take advantage of SpriteBatch
	var emitterDuration = 2.5;
	
	this._emitter = new cc.ParticleFlower();
	this._emitter.duration = emitterDuration;
	this._emitter.setTotalParticles(50);
	this._emitter.texture = cc.textureCache.addImage(res.Stars_png);
	this._emitter.x = pos.x;
	this._emitter.y = pos.y;
	if (this._emitter.setShapeType)
		this._emitter.setShapeType(cc.ParticleSystem.STAR_SHAPE);
	this._texHappyBirthdayBatch.removeChild(this._container);
	this.addChild(this._emitter);
	
	var seq = cc.sequence(
			cc.delayTime(emitterDuration),
			cc.callFunc(this.onSplashParticlesEnding, this, pos)
	);
	
	this.runAction(seq);
	
};

var SysMenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SysMenuLayer();
        this.addChild(layer);
    }
});

