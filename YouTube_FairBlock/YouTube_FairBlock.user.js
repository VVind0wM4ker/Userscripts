// ==UserScript==
// @name                YouTube FairBlock
// @name:de             YouTube FairBlock
// @version             1.0
// @description         Hides and mutes ads automatically
// @description:de      Schaltet Werbung auf YouTube automatisch stumm
// @autor               VVind0wM4ker
// @namespace           https://github.com/VVind0wM4ker/Userscripts
// @homepageURL         https://github.com/VVind0wM4ker/Userscripts/tree/master/YouTube_FairBlock
// @license             MIT License
// @grant               none
// @include             http*://*.youtube.com/watch*
// ==/UserScript==


var adPlaying = 0;
var i = 0;

var video = document.getElementsByClassName("video-stream html5-main-video")[0];
var player = document.getElementsByClassName("html5-video-player")[0];


function setup (resume) {

    var hasAds = hasClass(player, "ad-created");

    if (hasAds === true ) {
        
        if (resume != 1) {console.log("Video has Ads");}
        
        detectAds.observe(player, config1);
        
        video.onplay = function () {detectAds.disconnect();setTimeout(function(){setup(1);}, 1000);}; //Delay for Content to load
        video.onpause = function() {detectAds.disconnect();};
    }
    else {console.log("Video has no Ads :)");return;}
}


var detectAds = new MutationObserver(
    
    function() {

        console.log("check for Ads");

        //logTries();        //Test function
        
        if (hasClass(player, "ad-showing") === true) {                
        
             if (hasClass(player, "ad-interrupting") === true) {videoAd();}
             else{setTimeout(function(){ popupAd(); }, 50);}
        }
        else{video.unMute();}
    }
);


var skipVideo = new MutationObserver(
    
    function() {
        
        adPlaying = 1;
        
        var skipContainer = document.getElementsByClassName("videoAdUiSkipContainer")[0];
        var skipAdButton = document.getElementsByClassName("videoAdUiSkipButton");

        if (skipAdButton.length > 0 && skipContainer.style.display != "none") {

            skipAdButton[0].click();
            adPlaying = 0;
            skipVideo.disconnect();
            detectAds.disconnect();
            
            setTimeout(function(){setup(1);}, 1000);
        }
    }
);


function videoAd () {

    video.mute();

    var skipContainer = document.getElementsByClassName("videoAdUiSkipContainer")[0];
    var skipAdButton = document.getElementsByClassName("videoAdUiSkipButton").length;
    if (adPlaying === 0 && skipAdButton > 0) {skipVideo.observe(skipContainer, config2);}
}


function popupAd () {
    
    var closePopup = document.getElementsByClassName("close-button");
    if (closePopup.length > 0) {closePopup[0].click();}
}


function hasClass (element, cls) {

    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}


function logTries () {
    
    document.getElementById("eow-title").innerHTML = i;
    i++;
}


var config1 = {
    
    attributes: true,
    childList: false,
    subtree: false,
    attributeFilter: ['class']
};


var config2 = {
    
    attributes: true,
    childList: false,
    subtree: false,
};


document.addEventListener("DOMContentLoaded", setup(), false);
