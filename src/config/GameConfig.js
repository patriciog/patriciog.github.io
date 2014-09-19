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

// Global constants
var HB = HB || {};

HB.GAME_STATE = {
	SLEEP:0,
	PLAY:1
};

HB.PRESSED_KEYS = [];

HB.ZORDER = {
	LETTER:-10,
	GROUND:-9,
	CHARACTER:-8
}

HB.UNIT_TAG = {
    LETTER:900,
    CHARACTER:901,
    LEFT_CONTROL:950,
    RIGHT_CONTROL:951,
    UP_CONTROL:952
};

HB.CONTAINER = {
    LETTERS:[]
};

HB.FLOOR = {
	POSITION_Y:50,
	FIT:3
}

HB.AUDIO = {
	ENABLED:true,
	MUSIC:1.0,
	SOUND_FX:0.25
};

HB.TUTORIAL = {
	ANIM_DURATION_DOWN:1.0,
	ANIM_DURATION_UP:1.0,
	REPETITIONS:3,
};

HB.ACTIVE_LETTERS = 0;

HB.LETTER_DURATION = 1.0;
