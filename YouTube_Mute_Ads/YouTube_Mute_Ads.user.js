// ==UserScript==
// @name                YouTube - Mute Ads
// @name:de             YouTube - Mute Ads
// @version             1.0.4
// @description         Automatically mutes VideoAds
// @description:de      Schaltet Werbung auf YouTube automatisch stumm
// @autor               VVind0wM4ker
// @namespace           https://github.com/VVind0wM4ker/Userscripts
// @homepageURL         https://github.com/VVind0wM4ker/Userscripts/tree/master/YouTube_Mute_Ads
// @license             MIT License
// @grant               none
// @include             http*://*.youtube.com/watch*
// ==/UserScript==


var adPlaying = 0;
var interval = 500
var vid = document.getElementsByClassName("video-stream html5-main-video")[0];

var timer;


vid.onplay = function() {startTimer();};
vid.onpause = function() {pauseTimer();};
    
	
	
var muteAds = function () {
    
    //console.log("check for Ads")					//for testing
    
    if (document.getElementsByClassName("ad-interrupting").length > 0) {
        
        adPlaying = 1;
        vid.mute();
    }
    else {
        
        if (adPlaying == 1) {
            
            adPlaying = 0;
            vid.unMute();
        }
    }
};



function pauseTimer () {
    
    clearInterval(timer);
}

function startTimer () {
    
    clearInterval(timer);
    timer = setInterval(muteAds, interval);
}