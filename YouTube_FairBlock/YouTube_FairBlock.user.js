// ==UserScript==
// @name                YouTube FairBlock
// @version             2.0.0-dev
// @description         Mutes and skips ads on YouTube automatically
// @description:de      Schaltet YouTube-Werbung automatisch stumm und überspringt sie
// @autor               VVind0wM4ker
// @namespace           https://github.com/VVind0wM4ker/Userscripts
// @homepageURL         https://github.com/VVind0wM4ker/Userscripts/tree/master/YouTube_FairBlock
// @license             MIT License
// @grant               none
// @noframes
// @include             ^https?:\/\/www\.youtube\.com\/?(watch\?[^\/]+|user\/[^\/]+(\/featured)?)?$
// @updateURL           https://github.com/VVind0wM4ker/Userscripts/raw/develop/YouTube_FairBlock/YouTube_FairBlock.user.js
// @downloadURL         https://github.com/VVind0wM4ker/Userscripts/raw/develop/YouTube_FairBlock/YouTube_FairBlock.user.js
// ==/UserScript==

const DEBUG = true;

var adStarted = false;
var playerMutedBefore;

// ----- Setters and Getters -----
// Getter functions instead of vars to prevent getting old elements
// in case of navigation for example
function setPlayerMutedBefore(state) {
  if (state === true || state === false) {
    log("Set playerMutedBefore: [" + state + "]");
    playerMutedBefore = state;
  }
}

function getVideo() {
  return document.getElementsByClassName("video-stream html5-main-video")[0];
}
function getPlayer() {
  return document.getElementsByClassName("html5-video-player")[0];
}
function getVideoAdSkipBtn() {
  if (getPlayer() !== undefined) {
    return getPlayer().querySelectorAll("div.videoAdUiSkipContainer")[0];
  }
  return undefined;
}
function getVideoAdContainer() {
  if (getPlayer() !== undefined) {
    return getPlayer().getElementsByClassName("ad-container")[0];
  }
  return undefined;
}
function getVideoAdCloseBtn() {
  if(getVideoAdContainer() !== undefined) {
    return getVideoAdContainer().getElementsByClassName("close-button")[0];
  }
}
function getMuteBtn() {
  if (getPlayer() !== undefined) {
    return getPlayer().querySelectorAll("button.ytp-mute-button")[0];
  }
  return undefined;
}

function isAdPlaying() {
  if (getPlayer() !== undefined) {
    return getPlayer().className.indexOf("ad-interrupting") != -1;
  }
  return undefined;
}
// -------------------------------

// ----- Debug functions -----
function log(msg) {
  if (DEBUG === true)
    console.log("[DEBUG] " + msg);
}

function logFunc(funcName, param = "") {
  log(funcName + "(" + param + ")");
}
// ---------------------------

const PLAYER_ADSKIPPER = new MutationObserver(function(mutation) {
  if (getComputedStyle(getVideoAdSkipBtn())['display'] != "none") {
    log("skipping ad...")
    getVideoAdSkipBtn().firstChild.click();
    PLAYER_ADSKIPPER.disconnect();
  }
});
const PLAYER_ADSKIPPER_CONF = {
    attributes: true,
    childList: false,
    characterData: false,
    attributeFilter: ['style']
};

function hook(param = "") {
  logFunc("hook", param);
  // add eventlistener if userscript started before the site finished loading
  if (document.readyState == "loading") {
    log("site not loaded\n" +
        "adding EventListener...");
    document.addEventListener("DOMContentLoaded", function() {hook("DOM");});
    return;
  }
  log("site loaded")
  // detect navigation on the site
  document.body.addEventListener("yt-navigate-finish", function() {
    setup("yt-nav")
  });
  setup("DOM");
}

function setup(param = "") {
  logFunc("setup", param);
  // prevent mess if setup() is called more than once
  if (getVideo().onplay === null) {
    freshSetup = true;
    getVideoAdContainer().addEventListener("DOMNodeInserted", function() {
      closeVideoPopupAd();
    });
    getVideo().onplay = function() {analVideo()};
  }
};

// ( ͡° ͜ʖ ͡°)
function analVideo() {
  logFunc("analVideo");
  if (isAdPlaying() === true && adStarted === false ) {
      adStarted = true;
      setPlayerMutedBefore(getPlayer().isMuted());
      getPlayer().mute();
      if (getVideoAdSkipBtn() !== undefined) {
        log("video playing: Ad(skipable)");
        PLAYER_ADSKIPPER.observe(getVideoAdSkipBtn(), PLAYER_ADSKIPPER_CONF);
        return;
      }
      log("video playing: Ad(unskipable)");
  }
  else if (isAdPlaying() === false) {
    log("Video playing: Video");
    
    if (adStarted === true) {
      adStarted = false;
      if (playerMutedBefore === true) {
        log("Video returned, muting player...");
        getPlayer().mute();
        return;
      }
      log("Video returned, unmuting player...");
      getPlayer().unMute();      
    }
  }
}

function closeVideoPopupAd() {
  logFunc("closeVideoPopupAd");
  if (getComputedStyle(getVideoAdContainer())['display'] != "none" &&
      getVideoAdCloseBtn() !== undefined)
  {
    log("closing ad...")
    getVideoAdCloseBtn().click();
  }
}

hook("userscript loaded");