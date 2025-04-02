(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AudioRecorder"] = factory();
	else
		root["AudioRecorder"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Timer.js":
/*!**********************!*\
  !*** ./src/Timer.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timer)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Timer = /*#__PURE__*/function () {
  function Timer() {
    _classCallCheck(this, Timer);
    this.reset();
  }
  return _createClass(Timer, [{
    key: "reset",
    value: function reset() {
      this.startTime = null; // May be modified when resuming, so not the true start time.
      this.stoppedTime = null;
    }
  }, {
    key: "start",
    value: function start() {
      if (!this.startTime) {
        this.startTime = Date.now();
      }
      if (this.stoppedTime) {
        // Skip time forward by the time length we were stopped
        this.startTime += Date.now() - this.stoppedTime;
        this.stoppedTime = null;
      }
    }
  }, {
    key: "resetAndStart",
    value: function resetAndStart() {
      this.reset();
      this.start();
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.stoppedTime) {
        this.stoppedTime = Date.now();
      }
    }
  }, {
    key: "getTime",
    value: function getTime() {
      if (this.startTime) {
        if (this.stoppedTime) {
          return this.stoppedTime - this.startTime;
        } else {
          return Date.now() - this.startTime;
        }
      } else {
        return 0;
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/mp3worker/WorkerEncoder.js":
/*!****************************************!*\
  !*** ./src/mp3worker/WorkerEncoder.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerEncoder)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var workerStates = {
  INACTIVE: 0,
  LOADING: 1,
  READY: 2,
  ERROR: 3
};
var worker = null;
var workerState = workerStates.INACTIVE;
var workerStateChangeCallbacks = [];
var jobCallbacks = {};
function uuidv4() {
  // https://stackoverflow.com/a/2117523
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
  });
}
function notifyWorkerState(newState) {
  workerState = newState;
  for (var _i = 0, _workerStateChangeCal = workerStateChangeCallbacks; _i < _workerStateChangeCal.length; _i++) {
    var callback = _workerStateChangeCal[_i];
    callback();
  }
  workerStateChangeCallbacks = [];
}

// This hack required to load worker from another domain (e.g. a CDN)
// https://stackoverflow.com/a/62914052
function getWorkerCrossDomainURL(url) {
  var content = "importScripts(\"".concat(url, "\");");
  return URL.createObjectURL(new Blob([content], {
    type: "text/javascript"
  }));
}
function loadWorker(workerUrl) {
  if (/^https?:\/\//.test(workerUrl)) {
    // Is it an absolute URL? Then consider it cross domain.
    workerUrl = getWorkerCrossDomainURL(workerUrl);
  }
  worker = new Worker(workerUrl);
  workerState = workerStates.LOADING;
  worker.onmessage = function (event) {
    switch (event.data.message) {
      case "ready":
        notifyWorkerState(workerStates.READY);
        break;
      case "encoded":
        if (event.data.jobId in jobCallbacks) {
          jobCallbacks[event.data.jobId].onencoded(event.data.srcBufLen);
        }
        break;
      case "data":
        if (event.data.jobId in jobCallbacks) {
          jobCallbacks[event.data.jobId].ondataavailable(event.data.data);
        }
        break;
      case "stopped":
        if (event.data.jobId in jobCallbacks) {
          jobCallbacks[event.data.jobId].onstopped();
        }
        break;
    }
  };
  worker.onerror = function (event) {
    console.error("mp3worker error event", event);
    notifyWorkerState(workerStates.ERROR);
  };
}

// Callbacks:
// - ondataavailable
// - onstopped
var WorkerEncoder = /*#__PURE__*/function () {
  function WorkerEncoder(options) {
    var _this = this;
    _classCallCheck(this, WorkerEncoder);
    this.jobId = uuidv4();
    this.options = options;
    this.queuedData = 0;
    jobCallbacks[this.jobId] = {
      onencoded: function onencoded(srcBufLen) {
        _this.queuedData -= srcBufLen;
      },
      ondataavailable: function ondataavailable(data) {
        _this.ondataavailable && _this.ondataavailable(data);
      },
      onstopped: function onstopped() {
        delete jobCallbacks[_this.jobId]; // Clean up
        _this.onstopped && _this.onstopped();
      }
    };
  }
  return _createClass(WorkerEncoder, [{
    key: "start",
    value: function start() {
      worker.postMessage({
        command: "start",
        jobId: this.jobId,
        options: this.options
      });
    }
  }, {
    key: "sendData",
    value: function sendData(buffers) {
      // Check for an empty buffer
      if (buffers && buffers.length > 0 && buffers[0].length > 0) {
        this.queuedData += buffers[0].length;
        worker.postMessage({
          command: "data",
          jobId: this.jobId,
          buffers: buffers
        });
      }
    }

    // Amount of data that is not yet encoded.
  }, {
    key: "getQueuedDataLen",
    value: function getQueuedDataLen() {
      return this.queuedData;
    }
  }, {
    key: "stop",
    value: function stop() {
      worker.postMessage({
        command: "stop",
        jobId: this.jobId
      });
    }
  }], [{
    key: "preload",
    value: function preload(workerUrl) {
      if (workerState == workerStates.INACTIVE || workerState == workerStates.ERROR) {
        loadWorker(workerUrl);
      }
    }
  }, {
    key: "waitForWorker",
    value: function waitForWorker(workerUrl) {
      if (workerState == workerStates.READY) {
        return Promise.resolve();
      } else {
        // Worker loading already failed, try again...
        if (workerState == workerStates.INACTIVE || workerState == workerStates.ERROR) {
          loadWorker(workerUrl);
        }
        return new Promise(function (resolve, reject) {
          workerStateChangeCallbacks.push(function () {
            if (workerState == workerStates.READY) {
              resolve();
            } else {
              var error = new Error("MP3 worker failed");
              error.name = "WorkerError";
              reject(error);
            }
          });
        });
      }
    }
  }]);
}();


/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   detectIOS: () => (/* binding */ detectIOS),
/* harmony export */   detectSafari: () => (/* binding */ detectSafari),
/* harmony export */   stopStream: () => (/* binding */ stopStream)
/* harmony export */ });
function stopStream(stream) {
  if (stream.getTracks) {
    stream.getTracks().forEach(function (track) {
      return track.stop();
    });
  } else {
    stream.stop(); // Deprecated
  }
}

// https://stackoverflow.com/a/9039885
function detectIOS() {
  return ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)
  // iPad on iOS 13 detection
  || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function detectSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/AudioRecorder.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioRecorder)
/* harmony export */ });
/* harmony import */ var _mp3worker_WorkerEncoder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mp3worker/WorkerEncoder.js */ "./src/mp3worker/WorkerEncoder.js");
/* harmony import */ var _Timer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Timer.js */ "./src/Timer.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./src/utils.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var AudioContext = window.AudioContext || window.webkitAudioContext;
// Don't use audio worklet on iOS or safari, fall back to ScriptProcessor.
// There are issues with dropped incoming audio data after ~45 seconds. Thus, the resulting audio would be shorter and sped up / glitchy.
// Curiously, these same issues are present if *not using* AudioWorklet on Chrome
var audioWorkletSupported = window.AudioWorklet && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.detectIOS)() && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.detectSafari)();
var states = {
  STOPPED: 0,
  RECORDING: 1,
  PAUSED: 2,
  STARTING: 3,
  STOPPING: 4
};
var DEFAULT_OPTIONS = {
  recordingGain: 1,
  encoderBitRate: 96,
  streaming: false,
  streamBufferSize: 50000,
  forceScriptProcessor: false,
  constraints: {
    channelCount: 1,
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true
  }
};
var workerUrl = null;
function createCancelStartError() {
  var error = new Error("AudioRecorder start cancelled by call to stop");
  error.name = "CancelStartError";
  return error;
}
function getNumberOfChannels(stream) {
  var audioTracks = stream.getAudioTracks();
  if (audioTracks.length < 1) {
    throw new Error("No audio tracks in user media stream");
  }
  var trackSettings = audioTracks[0].getSettings();
  return "channelCount" in trackSettings ? trackSettings.channelCount : 1;
}

// Worklet does nothing more than pass the data out, to be actually encoded by a regular Web Worker
// Previously this was rewritten to do the encoding within an AudioWorklet, and it was all very nice and clean
// but apparently doing anything that uses much CPU in a AudioWorklet will cause glitches in some browsers.
// So, it's best to do the encoding in a regular Web Worker.
var AUDIO_OUTPUT_MODULE_URL = URL.createObjectURL(new Blob(["\n\tclass AudioOutputProcessor extends AudioWorkletProcessor {\n\t\tprocess(inputs, outputs) {\n\t\t\tthis.port.postMessage(inputs[0]);\n\t\t\treturn true;\n\t\t}\n\t}\n\n\tregisterProcessor(\"audio-output-processor\", AudioOutputProcessor);\n"], {
  type: "application/javascript"
}));

/*
Callbacks:
	ondataavailable
	onstart - called when recording successfully started
	onstop - called when all data finished encoding and was output
	onerror - error starting recording
*/
var AudioRecorder = /*#__PURE__*/function () {
  function AudioRecorder(options) {
    _classCallCheck(this, AudioRecorder);
    this.options = _objectSpread(_objectSpread({}, DEFAULT_OPTIONS), options);
    this.state = states.STOPPED;
    this.audioContext = null;
    this.encoder = null;
    this.encodedData = null;
    this.stopPromiseResolve = null;
    this.stopPromiseReject = null;
    this.timer = new _Timer_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
  }
  return _createClass(AudioRecorder, [{
    key: "useAudioWorklet",
    value:
    // Will we use AudioWorklet?
    function useAudioWorklet() {
      return audioWorkletSupported && !this.options.forceScriptProcessor;
    }
  }, {
    key: "createAndStartEncoder",
    value: function createAndStartEncoder(numberOfChannels) {
      var _this = this;
      this.encoder = new _mp3worker_WorkerEncoder_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
        originalSampleRate: this.audioContext.sampleRate,
        numberOfChannels: numberOfChannels,
        encoderBitRate: this.options.encoderBitRate,
        streamBufferSize: this.options.streamBufferSize
      });
      this.encoder.ondataavailable = function (data) {
        if (_this.options.streaming) {
          _this.ondataavailable && _this.ondataavailable(data);
        } else {
          _this.encodedData.push(data);
        }
      };
      this.encoder.onstopped = function () {
        _this.state = states.STOPPED;
        var mp3Blob = _this.options.streaming ? undefined : new Blob(_this.encodedData, {
          type: "audio/mpeg"
        });
        _this.onstop && _this.onstop(mp3Blob);
        _this.stopPromiseResolve(mp3Blob);
      };
      this.encoder.start();
    }
  }, {
    key: "createOutputNode",
    value: function createOutputNode(numberOfChannels) {
      var _this2 = this;
      if (this.useAudioWorklet()) {
        console.log("Using AudioWorklet");
        this.outputNode = new AudioWorkletNode(this.audioContext, "audio-output-processor", {
          numberOfOutputs: 0
        });
        this.outputNode.port.onmessage = function (_ref) {
          var data = _ref.data;
          if (_this2.state == states.RECORDING) {
            _this2.encoder.sendData(data);
          }
        };
      } else {
        console.log("Using ScriptProcessorNode");
        this.outputNode = this.audioContext.createScriptProcessor(4096, numberOfChannels, numberOfChannels);
        this.outputNode.connect(this.audioContext.destination);
        this.outputNode.onaudioprocess = function (event) {
          if (_this2.state == states.RECORDING) {
            var inputBuffer = event.inputBuffer;
            var buffers = [];
            for (var i = 0; i < inputBuffer.numberOfChannels; i++) {
              buffers.push(inputBuffer.getChannelData(i));
            }
            _this2.encoder.sendData(buffers);
          }
        };
      }
    }
  }, {
    key: "createAudioNodes",
    value: function createAudioNodes(numberOfChannels) {
      this.createOutputNode(numberOfChannels);
      this.recordingGainNode = this.audioContext.createGain();
      this.setRecordingGain(this.options.recordingGain);
      this.recordingGainNode.connect(this.outputNode);
      this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);
      this.sourceNode.connect(this.recordingGainNode);
    }
  }, {
    key: "cleanupAudioNodes",
    value: function cleanupAudioNodes() {
      if (this.stream) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.stopStream)(this.stream);
        this.stream = null;
      }
      if (this.useAudioWorklet()) {
        this.outputNode && (this.outputNode.port.onmessage = null);
      } else {
        this.outputNode && (this.outputNode.onaudioprocess = null);
      }
      this.outputNode && this.outputNode.disconnect();
      this.recordingGainNode && this.recordingGainNode.disconnect();
      this.sourceNode && this.sourceNode.disconnect();
      this.audioContext && this.audioContext.close();
    }
  }, {
    key: "setRecordingGain",
    value: function setRecordingGain(gain) {
      this.options.recordingGain = gain;
      if (this.recordingGainNode) {
        this.recordingGainNode.gain.setTargetAtTime(gain, this.audioContext.currentTime, 0.01);
      }
    }
  }, {
    key: "time",
    get: function get() {
      return this.timer.getTime();
    }

    // Get the amount of data left to be encoded.
    // Useful to estimate if STOPPING state (encoding still ongoing) will last a while.
  }, {
    key: "getEncodingQueueSize",
    value: function getEncodingQueueSize() {
      return this.encoder ? this.encoder.getQueuedDataLen() : 0;
    }

    // Called after every "await" in start(), to check that stop wasn't called
    // and we should abandon starting
  }, {
    key: "stoppingCheck",
    value: function stoppingCheck() {
      if (this.state == states.STOPPING) {
        throw createCancelStartError();
      }
    }
  }, {
    key: "__start",
    value: function () {
      var _start = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(paused) {
        var constraints, numberOfChannels, startWasCancelled;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(this.state != states.STOPPED)) {
                _context.next = 2;
                break;
              }
              throw new Error("Called start when not in stopped state");
            case 2:
              if (!(workerUrl == null)) {
                _context.next = 4;
                break;
              }
              throw new Error("preload was not called on AudioRecorder");
            case 4:
              this.state = states.STARTING;
              this.encodedData = [];
              this.stream = null;
              _context.prev = 7;
              _context.next = 10;
              return _mp3worker_WorkerEncoder_js__WEBPACK_IMPORTED_MODULE_0__["default"].waitForWorker(workerUrl);
            case 10:
              this.stoppingCheck();

              // If a constraint is set, pass them, otherwise just pass true
              constraints = Object.keys(this.options.constraints).length > 0 ? this.options.constraints : true;
              _context.next = 14;
              return navigator.mediaDevices.getUserMedia({
                audio: constraints
              });
            case 14:
              this.stream = _context.sent;
              this.stoppingCheck();
              this.audioContext = new AudioContext();
              if (!this.useAudioWorklet()) {
                _context.next = 21;
                break;
              }
              _context.next = 20;
              return this.audioContext.audioWorklet.addModule(AUDIO_OUTPUT_MODULE_URL, {
                credentials: "omit"
              });
            case 20:
              this.stoppingCheck();
            case 21:
              // Channel count must be gotten from the stream, as it might not have supported
              // the desired amount specified in the constraints
              numberOfChannels = getNumberOfChannels(this.stream); // Successfully recording!
              this.createAndStartEncoder(numberOfChannels);
              this.createAudioNodes(numberOfChannels);
              if (paused) {
                this.timer.reset();
                this.state = states.PAUSED;
              } else {
                this.timer.resetAndStart();
                this.state = states.RECORDING;
              }
              this.onstart && this.onstart();
              _context.next = 35;
              break;
            case 28:
              _context.prev = 28;
              _context.t0 = _context["catch"](7);
              startWasCancelled = this.state == states.STOPPING;
              this.cleanupAudioNodes();

              // Reset so can attempt start again
              this.state = states.STOPPED;

              // Reject the stop promise now we have cleaned up and are in STOPPED state and ready to start() again
              if (startWasCancelled) {
                this.stopPromiseReject(_context.t0);
              }
              throw _context.t0;
            case 35:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[7, 28]]);
      }));
      function __start(_x) {
        return _start.apply(this, arguments);
      }
      return __start;
    }()
  }, {
    key: "__stop",
    value: function () {
      var _stop = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var _this3 = this;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              this.timer.stop();
              if (!(this.state == states.RECORDING || this.state == states.PAUSED)) {
                _context2.next = 8;
                break;
              }
              // Stop recording, but encoding may not have finished yet,
              // so we enter the stopping state.
              this.state = states.STOPPING;
              this.cleanupAudioNodes();
              this.encoder.stop();

              // Will be resolved later when encoding finishes
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                _this3.stopPromiseResolve = resolve;
              }));
            case 8:
              if (!(this.state == states.STARTING)) {
                _context2.next = 11;
                break;
              }
              this.state = states.STOPPING;

              // Will be rejected later when start() has completely finished operation
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                _this3.stopPromiseReject = reject;
              }));
            case 11:
              throw new Error("Called stop when AudioRecorder was not started");
            case 12:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function __stop() {
        return _stop.apply(this, arguments);
      }
      return __stop;
    }()
  }, {
    key: "start",
    value: function start() {
      var _this4 = this;
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var promise = this.__start(paused);
      promise["catch"](function (error) {
        // Don't send CancelStartError to onerror, as it's not *really* an error state
        // Only used as a promise rejection to indicate that starting did not succeed.
        if (error.name != "CancelStartError") {
          _this4.onerror && _this4.onerror(error);
        }
      });
      if (!this.onerror) {
        return promise;
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      var _this5 = this;
      var promise = this.__stop();
      promise["catch"](function (error) {
        if (error.name == "CancelStartError") {
          // Stop was called before recording even started
          // Send a onstop event anyway to indicate that recording can be retried.
          _this5.onstop && _this5.onstop(_this5.options.streaming ? undefined : null);
        } else {
          _this5.onerror && _this5.onerror(error);
        }
      });
      if (!this.onerror) {
        return promise;
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this.state == states.RECORDING) {
        this.state = states.PAUSED;
        this.timer.stop();
      }
    }
  }, {
    key: "resume",
    value: function resume() {
      if (this.state == states.PAUSED) {
        this.state = states.RECORDING;
        this.timer.start();
      }
    }
  }], [{
    key: "isRecordingSupported",
    value: function isRecordingSupported() {
      return AudioContext && navigator && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
    }
  }, {
    key: "preload",
    value: function preload(_workerUrl) {
      workerUrl = _workerUrl;
      _mp3worker_WorkerEncoder_js__WEBPACK_IMPORTED_MODULE_0__["default"].preload(workerUrl);
    }
  }]);
}();

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=audiorecorder.js.map