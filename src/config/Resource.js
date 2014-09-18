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

// Resource accesor.
var res = {
		
	//plist
    HappyBirthday_plist: "res/Published-HTML5/hb.plist",
    HappyBirthday_png: "res/Published-HTML5/hb.png",
    
    //image
    Particle_png: "res/particle.png",
    
    //music
    bgMusic_mp3 : 'res/Audio/Music/Bunny Dust Looped.mp3',
    
    //sound fx
    letterEffect01_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX131.mp3',
    letterEffect02_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX132.mp3',
    letterEffect03_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX133.mp3',
    letterEffect04_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX134.mp3',
    letterEffect05_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX135.mp3',
    letterEffect06_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX136.mp3',
    letterEffect07_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX137.mp3',
    letterEffect08_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX138.mp3',
    letterEffect09_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX139.mp3',
    letterEffect10_mp3 : 'res/Audio/Sound/Sound Effects FX 014/FX140.mp3',
    realization_mp3 : 'res/Audio/Sound/MS_Realization.mp3', // 'res/Audio/Sound/MS_Realization.mp3',
    
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}