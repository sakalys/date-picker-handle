/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers__ = __webpack_require__(1);


(function () {
  const picker = document.querySelector('.sakalys-date-range');

  const from = picker.querySelector('.skl-from'),
        fromHandle = from.querySelector('.handle'),
        to = picker.querySelector('.skl-to'),
        toHandle = to.querySelector('.handle');

  var out = document.querySelector('.testFrom');

  var daysFromToday = 0,
      moveTotal = 0,
      stackedMove = 0,
      acceleratorInterval = null,
      currentPosition;

  function setupHandleElement(el) {
    function stop(e) {
      e.preventDefault();
    }
    el.addEventListener('dragstart', stop);
    el.addEventListener('touchstart', stop);
  }

  setupHandleElement(fromHandle);
  setupHandleElement(toHandle);

  function pressedCb(e) {
    enableScroll(e);
  }
  function unpressedCb(e) {
    disableScroll(e);
  }

  fromHandle.addEventListener('mousedown', pressedCb);
  fromHandle.addEventListener('touchstart', pressedCb);

  function moveListener(e) {

    currentPosition = e.screenY;

    moveTotal += stackedMove;
    // stackedMove = 0;

    daysFromToday = moveTotal / 30;

    if (daysFromToday > 0) {
      daysFromToday = Math.floor(daysFromToday);
    } else {
      daysFromToday = Math.ceil(daysFromToday);
    }

    out.innerHTML = formatDate(Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["a" /* prepareDate */])(daysFromToday));
  }

  function formatDate(date) {
    return paddy(date.getDate(), 2) + "/" + paddy(date.getMonth() + 1, 2) + "/" + date.getFullYear();
  }

  function paddy(subject, length, padChar) {
    var pad_char = typeof padChar !== 'undefined' ? padChar : '0';
    var pad = new Array(1 + length).join(pad_char);
    return (pad + subject).slice(-pad.length);
  }

  function enableScroll(e) {
    document.addEventListener('mouseup', unpressedCb);
    document.addEventListener('touchend', unpressedCb);
    document.addEventListener('touchcancel', unpressedCb);
    out.innerHTML = formatDate(Object(__WEBPACK_IMPORTED_MODULE_0__helpers__["a" /* prepareDate */])(daysFromToday));

    currentPosition = e.screenY;

    document.addEventListener('mousemove', moveListener);
    document.addEventListener('touchmove', moveListener);
    startAccelerator();
  }

  function disableScroll() {
    document.removeEventListener('mousemove', moveListener);
    document.removeEventListener('touchmove', moveListener);
    stopAccelerator();
  }

  function startAccelerator() {

    function getCurrentPosition() {
      return currentPosition;
    }

    var samplesPerSecond = 30;

    var previousPos = getCurrentPosition();

    var mediumVel = 1;

    acceleratorInterval = setInterval(function () {
      var velocity = 1;
      var thisPos = getCurrentPosition();
      var diff = previousPos - thisPos;

      var absDiff = Math.abs(diff);

      if (absDiff < 8) {
        velocity = 1;
      } else if (absDiff < 22) {
        velocity = 10;
      } else if (absDiff < 50) {
        velocity = 300;
      } else if (absDiff < 90) {
        velocity = 1000;
      }

      var newMedium = (3 * mediumVel + 1 * velocity) / 4;

      mediumVel = Math.floor(newMedium * 100) / 100;

      previousPos = thisPos;

      stackedMove = mediumVel - 1;
    }, 1000 / samplesPerSecond);
  }

  function stopAccelerator() {
    if (!acceleratorInterval) {
      return;
    }

    clearInterval(acceleratorInterval);
  }
})();

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = prepareDate;
function prepareDate(dayDiff) {
  const date = new Date();

  date.setTime(date.getTime() + dayDiff * 1000 * 60 * 60 * 24);

  return date;
}

/***/ })
/******/ ]);