/**
 *  Cocos2d-html5 show case : Moon Warriors
 *
 * @Licensed:
 * This showcase is licensed under GPL.
 *
 *  @Authors:
 *  Programmer: Shengxiang Chen (陈升想), Dingping Lv (吕定平), Ricardo Quesada
 *  Effects animation: Hao Wu (吴昊)
 *  Quality Assurance: Sean Lin (林顺)
 *
 *  @Links:
 *  http://www.cocos2d-x.org
 *  http://bbs.html5china.com
 *
 */

var HB = HB || {};

//game state
HB.GAME_STATE = {
    SLEEP:0,
    PLAY:1
};

HB.PRESSED_KEYS = [];

/*

//keys
HB.KEYS = [];

//level
HB.LEVEL = {
    STAGE1:1,
    STAGE2:2,
    STAGE3:3
};

//life
HB.LIFE = 4;

//score
HB.SCORE = 0;

//sound
HB.SOUND = true;

//enemy move type
HB.ENEMY_MOVE_TYPE = {
    ATTACK:0,
    VERTICAL:1,
    HORIZONTAL:2,
    OVERLAP:3
};

*/

//delta x
HB.DELTA_X = -100;

//offset x
HB.OFFSET_X = -24;

//rot
HB.ROT = -5.625;

/*

//bullet type
HB.BULLET_TYPE = {
    PLAYER:1,
    ENEMY:2
};

//weapon type
HB.WEAPON_TYPE = {
    ONE:1
};
*/
//unit tag
HB.UNIT_TAG = {
    LETTER:900,
    CHARACTER:901
};
/*
//attack mode
HB.ENEMY_ATTACK_MODE = {
    NORMAL:1,
    TSUIHIKIDAN:2
};

//life up sorce
HB.LIFEUP_SORCE = [50000, 100000, 150000, 200000, 250000, 300000];

*/

//container
HB.CONTAINER = {
    LETTERS:[]
};

/*

//bullet speed
HB.BULLET_SPEED = {
    ENEMY:-200,
    SHIP:900
};
 */
// the counter of active enemies
HB.ACTIVE_ENEMIES = 0;
