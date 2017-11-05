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
const VIDEO_CLASS = "video-stream html5-main-video";
const PLAYER_CLASS = "html5-video-player";
const PLAYER_VIDEOADPLAYING_CLASS = "ad-interrupting";
const PLAYER_SKIPBTN_CLASS = "videoAdUiSkipContainer";
const PLAYER_MUTEBTN_CLASS = "ytp-mute-button";

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
  return document.getElementsByClassName(VIDEO_CLASS)[0];
}
function getPlayer() {
  return document.getElementsByClassName(PLAYER_CLASS)[0];
}
function getSkipBtn() {
  let results = getPlayer().querySelectorAll("div." + PLAYER_SKIPBTN_CLASS);
  if (results.length > 0) {
    return results[0];
  } else {
    return null;
  }
}
function getMuteBtn() {
  return getPlayer().querySelectorAll("button." + PLAYER_MUTEBTN_CLASS)[0];
}

function isAdPlaying() {
  return getPlayer().className.indexOf(PLAYER_VIDEOADPLAYING_CLASS) != -1
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

const ADSKIPPER = new MutationObserver(function(mutation) {
  if (getComputedStyle(getSkipBtn())['display'] != "none") {
    log("skipping ad...")
    getSkipBtn().firstChild.click();
    ADSKIPPER.disconnect();
  }
});
const ADSKIPPER_CONF = {
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
      if (getSkipBtn() !== null) {
        log("video playing: Ad(skipable)");
        ADSKIPPER.observe(getSkipBtn(), ADSKIPPER_CONF);
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

hook("userscript loaded");