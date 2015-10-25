// ==UserScript==
// @name             YouTube - Mute Ads
// @name:de          YouTube - Mute Ads
// @version          1.0.2
// @description      Automatically mutes VideoAds
// @description:de   Schaltet Werbung auf YouTube automatisch stumm
// @autor            VVind0wM4ker
// @namespace        firewaterairanddirt
// @license	     http://creativecommons.org/licenses/by-nc/4.0/
// @grant            none
// @include          http*://*.youtube.com/watch*
// ==/UserScript==


var adPlaying = 0;
var interval = 500;    //checking for Ads all 0.5 seconds, keep in mind lower interval rates = lower performance
var vid = document.getElementsByClassName("video-stream html5-main-video")[0];

var timer, adTimeout;


vid.onplay = function() {startTimer();};
vid.onpause = function() {pauseTimer();};
    
	
	
var muteAds = function () {
    
    //console.log("check for Ads");                                                            //write to console, everytime the script gets executed - debug function
    
    if (document.getElementsByClassName("ad-showing").length > 0) {
        
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
    clearTimeout(adTimeout);
}

function startTimer () {
    
    clearInterval(timer);
    clearTimeout(adTimeout);
    timer = setInterval(muteAds, interval);
}