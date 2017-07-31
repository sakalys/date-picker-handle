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
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = __webpack_require__(1);
class ValueSlider {
    constructor(el) {
        this.el = el;
        this.divider = 8;
        this.date = new Date;
        this.initialType = el.type;
        this.value = el.value;
        this._init();
    }
    _init() {
        this.el.type = 'hidden';
        this.wrapper = this._createWrapper(this.el);
        this.handles = this._createHandles();
        this.wrapper.appendChild(this.handles.year);
        this.wrapper.appendChild(document.createTextNode('-'));
        this.wrapper.appendChild(this.handles.month);
        this.wrapper.appendChild(document.createTextNode('-'));
        this.wrapper.appendChild(this.handles.day);
        this.el.parentElement.insertBefore(this.wrapper, this.el);
        this._updateText();
    }
    _createWrapper(el) {
        const container = document.createElement('div');
        el.className.split(' ').forEach(className => container.classList.add(className));
        return container;
    }
    _setupHandle(handle) {
        this._on(handle, 'mousedown', this._getSliderCb(handle).bind(this));
    }
    static moveCb(e) {
        ValueSlider.mousePosition = e.screenY;
    }
    _on(el, events, cb) {
        events.split(' ').forEach((eventName) => {
            el.addEventListener(eventName, cb);
        });
    }
    _off(el, events, cb) {
        events.split(' ').forEach((eventName) => {
            el.removeEventListener(eventName, cb);
        });
    }
    _getSliderCb(handle) {
        return (e) => {
            e.preventDefault();
            let moveListener = ValueSlider.moveCb.bind(this);
            const _stopSlider = () => {
                this._off(document, 'mousemove', moveListener);
                this._off(document, 'mouseup', boundStopListener);
                this.stopClock();
            };
            const boundStopListener = _stopSlider.bind(this);
            this._on(document, 'mousemove', moveListener);
            this._on(document, 'mouseup', boundStopListener);
            ValueSlider.mousePosition = e.screenY;
            this.startClock(handle);
        };
    }
    _throttleUpdate(cb) {
        cb.apply(this);
    }
    static getCurrentPosition() {
        return ValueSlider.mousePosition;
    }
    startClock(handle) {
        this.tickData = {
            mediumVel: 1,
            samplesPerSecond: 30,
            previous: {
                velocity: 0,
                position: ValueSlider.getCurrentPosition()
            },
            handle: handle
        };
        this.acceleratorInterval = setInterval(this._tick.bind(this), 1000 / this.tickData.samplesPerSecond);
    }
    _tick() {
        const currentPosition = ValueSlider.getCurrentPosition();
        const diff = this.tickData.previous.position - currentPosition;
        const absDiff = Math.abs(diff);
        let direction = 0;
        if (diff > 0) {
            direction = 1;
        }
        else if (diff < 0) {
            direction = -1;
        }
        let velocity = (absDiff == 0 ? 0 : 1) * direction;
        let newMedium = this._calculateNewMediumVelocity(velocity);
        this.tickData.mediumVel = Math.floor(newMedium * 100) / 100;
        if (Math.abs(this.tickData.mediumVel) < 1) {
            this.tickData.mediumVel = 0;
        }
        this.tickData.previous.position = currentPosition;
        // handle.pixelsMoved = handle.pixelsMoved + diff;
        this._throttleUpdate(() => {
            // this.tickData.handle.updated(Math.floor(handle.pixelsMoved / this.divider));
            this._updateText();
        });
        this.tickData.previous.velocity = this.tickData.mediumVel;
    }
    _calculateNewMediumVelocity(currentVelocity) {
        return this.tickData.previous.velocity == 0 ? Math.floor(currentVelocity) : ((this.tickData.mediumVel + currentVelocity * 2) / 3);
    }
    stopClock() {
        if (!this.acceleratorInterval) {
            return;
        }
        clearInterval(this.acceleratorInterval);
    }
    _createHandles() {
        let handles = {};
        ['day', 'month', 'year'].forEach((handleName) => {
            const element = document.createElement('a');
            element.classList.add(handleName);
            Object.assign(element.style, {
                cursor: 'ns-resize',
            });
            handles[handleName] = element;
        });
        let year = handles.year;
        let month = handles.month;
        let day = handles.day;
        this._setupHandle(year);
        this._setupHandle(month);
        this._setupHandle(day);
        let [yearText, monthText, dayText] = this.value.split('-');
        this.date.setFullYear(parseInt(yearText));
        this.date.setMonth(parseInt(monthText) - 1);
        this.date.setDate(parseInt(dayText));
        let val;
        // YEAR
        val = parseInt(yearText);
        year.pixelsMoved = Math.floor(val * this.divider);
        year.updated = (newVal) => {
            this.date.setFullYear(newVal);
        };
        // MONTH
        val = parseInt(monthText);
        month.pixelsMoved = Math.floor(val * this.divider);
        month.updated = (newVal) => {
            if (newVal < 1) {
                month.compensate = -1;
            }
            else if (newVal > 12) {
                month.compensate = 1;
            }
            this.date.setMonth(newVal - 1);
        };
        val = parseInt(dayText);
        day.pixelsMoved = Math.floor(val * this.divider);
        day.updated = (newVal) => {
            this.date.setDate(newVal);
        };
        return handles;
    }
    _updateText() {
        this.handles.year.innerText = helpers_1.paddy(String(this.date.getFullYear()), 4);
        this.handles.month.innerText = helpers_1.paddy(String(this.date.getMonth() + 1), 2);
        this.handles.day.innerText = helpers_1.paddy(String(this.date.getDate()), 2);
    }
}
new ValueSlider(document.querySelector('.from'));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function prepareDate(dayDiff) {
    const date = new Date();
    date.setTime(date.getTime() + (dayDiff * 1000 * 60 * 60 * 24));
    return date;
}
exports.prepareDate = prepareDate;
function paddy(subject, length, padChar = '0') {
    const pad = new Array(1 + length).join(padChar);
    return (pad + subject).slice(-pad.length);
}
exports.paddy = paddy;
function formatDate(date) {
    return paddy(String(date.getDate()), 2)
        + "/"
        + paddy(String(date.getMonth() + 1), 2)
        + "/"
        + date.getFullYear();
}
exports.formatDate = formatDate;


/***/ })
/******/ ]);