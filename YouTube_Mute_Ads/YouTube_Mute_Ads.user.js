// ==UserScript==
// @name                YouTube - Mute Ads
// @name:de             YouTube - Mute Ads
// @version             2.1.0
// @description         Automatically mutes VideoAds
// @description:de      Schaltet Werbung auf YouTube automatisch stumm
// @author              VVind0wM4ker
// @namespace           https://github.com/VVind0wM4ker/Userscripts
// @homepageURL         https://github.com/VVind0wM4ker/Userscripts/tree/master/YouTube_Mute_Ads
// @license             MIT License
// @grant               none
// @noframes
// @include             http*://*.youtube.com/watch*
// @updateURL           https://github.com/VVind0wM4ker/Userscripts/raw/master/YouTube_Mute_Ads/YouTube_Mute_Ads.user.js
// @downloadURL         https://github.com/VVind0wM4ker/Userscripts/raw/master/YouTube_Mute_Ads/YouTube_Mute_Ads.user.js
// ==/UserScript==

var listenerAdded = false;
var adHandled = false;
var playerMutedBefore;

// Getter functions instead of vars to prevent getting old elements
// in case of navigation for example
function getVideo() {
  return document.getElementsByClassName("video-stream html5-main-video")[0];
}
function getPlayer() {
  return document.getElementsByClassName("html5-video-player")[0];
}
function getMuteBtn() {
  if (getPlayer()) {
    return getPlayer().querySelector(".ytp-mute-button button");
  }
  return null;
}
function isAdInterrupting() {
  if (getPlayer()) {
    return getPlayer().className.indexOf("ad-interrupting") !== -1;
  }
  return false;
}

// The player already implements mute(), unmute() and isMuted() and using them
// would be a bit cleaner. But since userscripts run in an isolated context, we
// could only call those functions via unsafeWindow.
//
// Let's avoid this, and reimplement these functions. This way we can keep
// maximum isolation.
function isMuted() {
  let btn = getMuteBtn();

  if (btn) {
    return btn.ariaLabel.includes("Unmute");
  }

  return null;
}
function mute() {
  if (!isMuted()) {
    let btn = getMuteBtn();
    if (btn) {
      getMuteBtn().click();
    }
  }
}
function unmute() {
  if (isMuted()) {
    getMuteBtn().click();
  }
}

function hook() {
  // add eventlistener if userscript started before the site finished loading
  if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      hook();
    });
    return;
  }
  // site loaded

  // detect navigation on the site
  document.body.addEventListener("yt-navigate-finish", function () {
    setup();
  });
  setup();
}

function setup() {
  // prevent mess if setup() is called more than once
  if (!listenerAdded) {
    listenerAdded = true;
    getVideo().onplay = function () {
      analVideo();
    };
  }
}

// ( ͡° ͜ʖ ͡°)
function analVideo() {
  if (isAdInterrupting() && adHandled === false) {
    adHandled = true;
    playerMutedBefore = isMuted();
    mute();
  } else if (!isAdInterrupting() && adHandled === true) {
    adHandled = false;
    if (playerMutedBefore === false) {
      unmute();
    } else {
      mute();
    }
  }
}

hook();
