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

// ----- Debug functions -----
function log(msg) {
  if (DEBUG === true)
    console.log("[DEBUG] " + msg);
}

function logFunc(funcName, param = "") {
  log(funcName + "(" + param + ")");
}
// ---------------------------

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
};

hook("userscript loaded");