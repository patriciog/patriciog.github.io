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
    CHARACTER:901
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

HB.ACTIVE_LETTERS = 0;

HB.LETTER_DURATION = 1.0;
