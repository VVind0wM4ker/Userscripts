// ==UserScript==
// @name                YouTube FairBlock
// @name:de             YouTube FairBlock
// @version             1.1.0
// @description         Mutes and skips ads automatically
// @description:de      Schaltet Werbung auf YouTube automatisch stumm
// @autor               VVind0wM4ker
// @namespace           https://github.com/VVind0wM4ker/Userscripts
// @homepageURL         https://github.com/VVind0wM4ker/Userscripts/tree/master/YouTube_FairBlock
// @license             MIT License
// @grant               none
// @include             http*://*.youtube.com/watch*
// ==/UserScript==

function initScript() {
    "use strict";

    console.log("YouTube FairBlock started");

    let adPlaying = 0;
    let i = 0;

    let video_ = document.getElementsByClassName("video-stream html5-main-video")[0];
    let player_ = document.getElementsByClassName("html5-video-player")[0];

    function setup(resume) {
        if (hasClass(player_, "ad-created") === true) {

            if (resume != 1) /* a little trick to only print once */
                { console.log("Video has Ads"); }

            detectAds.observe(player_, config1);
            video_.onplay = function() { detectAds.disconnect(); setTimeout(function() { setup(1); }, 1000); }; // Wait for Content to load
            video_.onpause = function() { detectAds.disconnect(); };
        } else {
            console.log("Video has no Ads :)");
            return;
        }
    }

    let detectAds = new MutationObserver(function() {
        console.log("check for Ads");

        //logTries();        //Test function

        if (hasClass(player_, "ad-showing") === true) {
            if (hasClass(player_, "ad-interrupting") === true) {
                videoAd();
            } else {
                setTimeout(function() { popupAd(); }, 50);
            }
        } else {
            player_.unMute();
        }
    });

    let skipVideo = new MutationObserver(function() {
        adPlaying = 1;

        let skipContainer = document.getElementsByClassName("videoAdUiSkipContainer")[0];
        let skipAdButton = document.getElementsByClassName("videoAdUiSkipButton");

        if (skipAdButton.length > 0 && skipContainer.style.display != "none") {

            skipAdButton[0].click();
            adPlaying = 0;
            skipVideo.disconnect();
            detectAds.disconnect();

            setTimeout(function() { setup(1); }, 1000);
        }
    });

    function videoAd() {
        player_.mute();
        let skipContainer = document.getElementsByClassName("videoAdUiSkipContainer")[0];
        let skipAdButtonLen = document.getElementsByClassName("videoAdUiSkipButton").length;
        if (adPlaying === 0 && skipAdButtonLen > 0) {
            skipVideo.observe(skipContainer, config2);
        }
    }

    function popupAd() {
        let closePopup = document.getElementsByClassName("close-button");
        if (closePopup.length > 0) {
            closePopup[0].click();
        }
    }

    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    function logTries() {
        document.getElementById("eow-title").innerHTML = i;
        i++;
    }

    let config1 = {
        attributes: true,
        childList: false,
        subtree: false,
        attributeFilter: ['class']
    };

    let config2 = {
        attributes: true,
        childList: false,
        subtree: false,
    };

    document.addEventListener("DOMContentLoaded", setup(), false);
}

initScript();
