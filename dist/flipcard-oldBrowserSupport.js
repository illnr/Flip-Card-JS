var FlipCard = (function () {
'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _constants = {
    /**
     * passive option, see:
     * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
     */
    passiveEventOption: function () {
        var passiveSupported = false;
        try {
            var options = Object.defineProperty({}, "passive", {
                get: function get$$1() {
                    passiveSupported = true;
                }
            });

            window.addEventListener("test", null, options);
            // console.log("One Time Only :) IIFE");
            return passiveSupported ? { passive: true } : false;
        } catch (err) {
            return false;
        }
    }(),
    /**
     * https://stackoverflow.com/questions/11387805/media-query-to-detect-if-device-is-touchscreen
     * https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
     * Didn't work on my macOS High Sierra 10.13.1 in Chrome 61, but works now in Chrome 62! :)
     */
    isTouchDevice: function () {
        return 'ontouchstart' in window // works on most browsers
        || navigator.maxTouchPoints // works on IE10/11 and Surface
        ;
    }()
};

var Helper = function () {
    function Helper() {
        classCallCheck(this, Helper);
    }

    createClass(Helper, null, [{
        key: "updateTransformProperty",

        /**
         * Updates the transform property of an element, preserving all other properties.
         * Can apply multiple transforms at once, but not use multiple with matrix and matrix3d! Not working yet!
         * example:
         *     updateTransformProperty(card.back, "rotateY(50deg) skewX(20deg");
         * @param {Element} element the element to update the transform style
         * @param {String} values the value to update the transform style to
         * @return {boolean}
         */
        value: function updateTransformProperty(element, values) {
            return _updateTransformProperty(element, values);
        }
    }]);
    return Helper;
}();

/**
 * Updates the transform property of an element, preserving all other properties.
 * Can apply multiple transforms at once, but careful with matrix and matrix3d!
 * ToDo: matrix + matrix3d case
 * example:
 *     _updateTransformProperty(card.back, "rotateY(50deg) skewX(20deg");
 * @param {Element} element the element to update the transform style
 * @param {String} values the value to update the transform style to
 * @return {boolean}
 * @private
 */
function _updateTransformProperty(element, values) {
    var previousVals = {};
    if (element.style.transform) {
        previousVals = element.style.transform.trim().match(/.+?\(.+?\)/g) // matches a word followed by '(' [...] ')'
        .map(function (val) {
            return val.trim().split(/[()]+/).filter(function (el) {
                return el;
            });
        } // split ([...]) example: ("translate(-50%, -50%)".split(/[()]+/).filter(el => el));
        ).reduce(function (acc, cur) {
            acc[cur[0]] = cur[1];return acc;
        }, {}) // make dict of it: {tranform-func: val}
        ;
    }
    var nextVals = values.trim().match(/.+?\(.+?\)/g) // matches a word followed by '(' [...] ')'
    .map(function (val) {
        return val.trim().split(/[()]+/).filter(function (el) {
            return el;
        });
    } // split ([...]) example: ("translate(-50%, -50%)".split(/[()]+/).filter(el => el));
    ).reduce(function (acc, cur) {
        acc[cur[0]] = cur[1];return acc;
    }, {});
    var updatedVals = Object.assign({}, previousVals, nextVals);
    var updatedValsString = "";
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(updatedVals)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            updatedValsString += key + "(" + updatedVals[key] + ") ";
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    updatedValsString.slice(0, -1);
    element.style.transform = updatedValsString;
    return true;
}

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/**
 * Easing Functions
 * Credits:
 * https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
 * http://robertpenner.com/easing/
 * http://upshots.org/actionscript/jsas-understanding-easing
 * http://sol.gfxile.net/interpolation/
 */
var Easing = function () {
  function Easing() {
    classCallCheck(this, Easing);
  }

  createClass(Easing, null, [{
    key: "easeOutElastic",

    /**
     * Easing function.
     * @param t current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time
     * @param b beginning value of the property
     * @param c change between the beginning and destination value of the property
     * @param d duration / total time of the tween
     * @return {*}
     * @private
     */
    value: function easeOutElastic(t, b, c, d) {
      var s = 1.70158;var p = 0;var a = c;
      if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
      if (a < Math.abs(c)) {
        a = c;s = p / 4;
      } else s = p / (2 * Math.PI) * Math.asin(c / a);
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    }
  }]);
  return Easing;
}();

var CardTouchSupport = function () {
    function CardTouchSupport(card) {
        classCallCheck(this, CardTouchSupport);

        this.card = card;
        this.animTime = 1000; // time in milliseconds for elastic animation (animateReturnToPlank())
        this.xDown = false; // point in x-direction of touchevent when touchstartHandler started
        this.isMoving = false; // touchmoveHandler is currently working
        this.touchStartDeg = 0; // deg when touchstartHandler started
        this.time = 0; // starting time for elastic animation (animateReturnToPlank())
        this.degGap = 0; // starting gap to endgoal for elastic animation (animateReturnToPlank())
        this.degStart = 0; // starting card deg for elastic animation (animateReturnToPlank())
        this.requestAnimationFrameID = 0; // current requestID of elastic animation (animateReturnToPlank())

        // function expression
        // https://stackoverflow.com/questions/46014034/es6-removeeventlistener-from-arrow-function-oop
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.touchmoveHandler = this.touchmoveHandler.bind(this);
        this.touchendHandler = this.touchendHandler.bind(this);
    }

    createClass(CardTouchSupport, [{
        key: "touchstartHandler",
        value: function touchstartHandler(event) {
            // Cancel current animation
            this.requestAnimationFrameID && window.cancelAnimationFrame(this.requestAnimationFrameID);
            // Use evt.originalEvent.touches instead of evt.touches if you are working with JQuery.
            // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
            this.xDown = event.touches[0].clientX;
            this.touchStartDeg = this.card.deg;
            /* ToDo: Bug if only click (tap) with finger it stops working */
        }
    }, {
        key: "touchmoveHandler",
        value: function touchmoveHandler(event) {
            if (!this.xDown || this.isMoving) return;
            this.isMoving = true;
            // Use evt.originalEvent.touches instead of evt.touches if you are working with JQuery.
            // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
            var xMove = event.touches[0].clientX;
            var xDiff = xMove - this.xDown;
            var xNew = this.touchStartDeg + xDiff;
            Helper.updateTransformProperty(this.card.front, "rotateY(" + xNew + "deg)");
            Helper.updateTransformProperty(this.card.back, "rotateY(" + (xNew + 180) + "deg)");
            this.card.deg = xNew;
            this.isMoving = false;
        }
    }, {
        key: "touchendHandler",
        value: function touchendHandler(event) {
            var _this = this;

            if (!this.xDown) return;
            this.xDown = null;
            // calculate correct degGap
            if (0 <= this.card.deg && this.card.deg < 90) {
                this.degGap = -this.card.deg;
            } else if (90 <= this.card.deg && this.card.deg < 180) {
                this.degGap = 180 - this.card.deg;
            } else if (180 <= this.card.deg && this.card.deg < 270) {
                this.degGap = 180 - this.card.deg;
            } else {
                this.degGap = 360 - this.card.deg;
            }
            this.degStart = this.card.deg;
            this.time = performance.now();
            // Start animation
            this.requestAnimationFrameID = window.requestAnimationFrame(function (highResTimestamp) {
                return _this.animateReturnToPlank(highResTimestamp);
            });
        }
    }, {
        key: "animateReturnToPlank",
        value: function animateReturnToPlank(currentTime) {
            var _this2 = this;

            if (currentTime - this.time > this.animTime) {
                // if run more than animTime(1000ms) - stop
                // this.degGap = 0;
                // this.degStart = 0;
                this.time = 0;
                this.requestAnimationFrameID = 0;
                return;
            }
            // const newDeg = Easing.easeOutElastic(currentTime - this.time, 0, 180, this.animTime);
            var newDeg = Easing.easeOutElastic(currentTime - this.time, this.degStart, this.degGap, this.animTime);

            Helper.updateTransformProperty(this.card.front, "rotateY(" + newDeg + "deg)");
            Helper.updateTransformProperty(this.card.back, "rotateY(" + (newDeg + 180) + "deg)");

            this.card.deg = newDeg;
            this.requestAnimationFrameID = window.requestAnimationFrame(function (highResTimestamp) {
                return _this2.animateReturnToPlank(highResTimestamp);
            });
        }
    }]);
    return CardTouchSupport;
}();

var CardMouseSupport = function () {
    function CardMouseSupport(card) {
        classCallCheck(this, CardMouseSupport);

        this.card = card;
        this.animTime = 3000; // time in milliseconds for animation (flip)
        this.time = 0; // starting time for elastic animation
        this.degGap = 180; // starting gap to endgoal for elastic animation
        this.degStart = 0; // starting card deg for elastic animation
        this.requestAnimationFrameID = 0; // current requestID of elastic animation

        // function expression
        // https://stackoverflow.com/questions/46014034/es6-removeeventlistener-from-arrow-function-oop
        this.mouseenterHandler = this.mouseenterHandler.bind(this);
        this.mouseleaveHandler = this.mouseleaveHandler.bind(this);
    }

    createClass(CardMouseSupport, [{
        key: "mouseenterHandler",
        value: function mouseenterHandler(event) {
            var _this = this;

            // Cancel current animation
            this.requestAnimationFrameID && window.cancelAnimationFrame(this.requestAnimationFrameID);
            this.degStart = this.card.deg;
            this.degGap = 180 - this.card.deg;
            if (this.degGap === 0) return;
            this.time = performance.now();
            // Start animation
            this.requestAnimationFrameID = window.requestAnimationFrame(function (highResTimestamp) {
                return _this.animateFlip(highResTimestamp);
            });
        }
    }, {
        key: "mouseleaveHandler",
        value: function mouseleaveHandler(event) {
            var _this2 = this;

            // Cancel current animation
            this.requestAnimationFrameID && window.cancelAnimationFrame(this.requestAnimationFrameID);
            this.degStart = this.card.deg;
            this.degGap = -this.card.deg;
            if (this.degGap === 0) return;
            this.time = performance.now();
            // Start animation
            this.requestAnimationFrameID = window.requestAnimationFrame(function (highResTimestamp) {
                return _this2.animateFlip(highResTimestamp);
            });
        }
    }, {
        key: "animateFlip",
        value: function animateFlip(currentTime) {
            var _this3 = this;

            if (currentTime - this.time > this.animTime) {
                // if run more than animTime(1000ms) - stop
                // this.degGap = 0;
                // this.degStart = 0;
                this.time = 0;
                this.requestAnimationFrameID = 0;
            }
            // console.log(`Timing: ${currentTime-this.time}, degStart: ${this.degStart}, degGap: ${this.degGap}, animTime: ${this.animTime}`);
            var newDeg = Easing.easeOutElastic(currentTime - this.time, this.degStart, this.degGap, this.animTime);

            Helper.updateTransformProperty(this.card.front, "rotateY(" + newDeg + "deg)");
            Helper.updateTransformProperty(this.card.back, "rotateY(" + (newDeg + 180) + "deg)");

            this.card.deg = newDeg;
            this.requestAnimationFrameID = window.requestAnimationFrame(function (highResTimestamp) {
                return _this3.animateFlip(highResTimestamp);
            });
        }
    }]);
    return CardMouseSupport;
}();

var Card = function () {
    function Card(container, front, back) {
        classCallCheck(this, Card);

        this.container = container;
        this.front = front;
        this.back = back;
        this.touchSupport = null;
        this.mouseSupport = null;
        this._deg = 0;
    }

    createClass(Card, [{
        key: "addTouchSupport",
        value: function addTouchSupport() {
            if (this.touchSupport || !_constants.isTouchDevice) return; // ToDo Test
            this.touchSupport = new CardTouchSupport(this);
            this.container.addEventListener('touchstart', this.touchSupport.touchstartHandler, _constants.passiveEventOption);
            this.container.addEventListener('touchmove', this.touchSupport.touchmoveHandler, _constants.passiveEventOption);
            this.container.addEventListener('touchend', this.touchSupport.touchendHandler, _constants.passiveEventOption);
        }
    }, {
        key: "removeTouchSupport",
        value: function removeTouchSupport() {
            if (!this.touchSupport) return; // ToDo Test
            this.container.removeEventListener('touchstart', this.touchSupport.touchstartHandler, _constants.passiveEventOption);
            this.container.removeEventListener('touchmove', this.touchSupport.touchmoveHandler, _constants.passiveEventOption);
            this.container.removeEventListener('touchend', this.touchSupport.touchendHandler, _constants.passiveEventOption);
            this.touchSupport = null;
        }
    }, {
        key: "addMouseSupport",
        value: function addMouseSupport() {
            if (this.mouseSupport || _constants.isTouchDevice) return; // ToDo Test
            this.mouseSupport = new CardMouseSupport(this);
            this.container.addEventListener('mouseenter', this.mouseSupport.mouseenterHandler, _constants.passiveEventOption);
            this.container.addEventListener('mouseleave', this.mouseSupport.mouseleaveHandler, _constants.passiveEventOption);
        }
    }, {
        key: "removeMouseSupport",
        value: function removeMouseSupport() {
            if (!this.mouseSupport) return; // ToDo Test
            this.container.removeEventListener('mouseenter', this.mouseSupport.mouseenterHandler, _constants.passiveEventOption);
            this.container.removeEventListener('mouseleave', this.mouseSupport.mouseleaveHandler, _constants.passiveEventOption);
            this.mouseSupport = null;
        }
    }, {
        key: "deg",
        get: function get$$1() {
            return this._deg;
        },
        set: function set$$1(no) {
            // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
            this._deg = (no % 360 + 360) % 360;
        }
    }]);
    return Card;
}();

/**
 * https://
 * Flip Card JS
 * @version 0.0.2
 * @author Fabian Wiesner
 * @copyright ⓒ2017 Fabian Wiesner
 * Released under the MIT licence
 */

/**
 * Possible options for passing to FlipCard constructor.
 * @type {{container: string, front: string, back: string, addCssBasic: boolean, addCssPositioning: boolean, addTouchSupport: boolean, addMouseSupport: boolean, domObjects: {cardList: Array}}}
 */
var defaults = {
    container: ".flip-card",
    front: ".flip-card-front",
    back: ".flip-card-back",
    addCssBasic: true,
    addCssPositioning: false,
    addTouchSupport: true,
    addMouseSupport: true,
    domObjects: {
        cardList: []
    }
};

/**
 * THE class all depends on :)
 * You can pass options,
 * @see defaults
 */

var FlipCard = function () {
    function FlipCard() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        classCallCheck(this, FlipCard);

        this.options = Object.assign({}, defaults, options);
        this.updateDomObjects();
        if (this.options.addCssBasic) _addCssBasic(this.options);
        if (this.options.addCssPositioning) _addCssPositioning(this.options);
        // ToDo: On Orientation Change || On Window Width Change = new CSS Positioning
        if (this.options.addTouchSupport) this.touchSupport.add();
        if (this.options.addMouseSupport) this.mouseSupport.add();
        // setTimeout(() => this.touchSupport.remove(), 2000);
    }

    /**
     * If Objects to manipulate change (container, front, back), call this.
     * @return {FlipCard}
     */


    createClass(FlipCard, [{
        key: "updateDomObjects",
        value: function updateDomObjects() {
            // Check if there are already objects in list
            if (this.options.domObjects.cardList.length === 0) {
                // Iterate over all containers and add them
                var containerList = document.querySelectorAll(this.options.container);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = containerList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var container = _step.value;

                        var front = container.querySelector(this.options.front);
                        var back = container.querySelector(this.options.back);

                        this.options.domObjects.cardList.push(new Card(container, front, back));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                // ToDo updateDomObjects - already have some
                console.error("ToDo! Not implemented yet, if there are already objects. updateDomObjects()");
            }
            return this;
        }

        /**
         * To enable touchSupport, you can call your FlipCard.touchSupport.add();
         * @return functions to call
         */

    }, {
        key: "touchSupport",
        get: function get$$1() {
            var _this = this;
            return {
                add: function add() {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _this.options.domObjects.cardList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var card = _step2.value;

                            card.addTouchSupport();
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                _iterator2.return();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }

                    return _this;
                },
                remove: function remove() {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = _this.options.domObjects.cardList[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var card = _step3.value;

                            card.removeTouchSupport();
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    return _this;
                }
            };
        }

        /**
         * To enable mouseSupport, you can call your FlipCard.mouseSupport.add();
         * @return functions to call
         */

    }, {
        key: "mouseSupport",
        get: function get$$1() {
            var _this = this;
            return {
                add: function add() {
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = _this.options.domObjects.cardList[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var card = _step4.value;

                            card.addMouseSupport();
                        }
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    return _this;
                },
                remove: function remove() {
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = _this.options.domObjects.cardList[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var card = _step5.value;

                            card.removeMouseSupport();
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }

                    return _this;
                }
            };
        }
    }]);
    return FlipCard;
}();

function _addCssBasic(options) {
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = options.domObjects.cardList[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var card = _step6.value;

            card.container.style.perspective = "400px";
            card.front.style.backfaceVisibility = "hidden";
            card.back.style.backfaceVisibility = "hidden";
            Helper.updateTransformProperty(card.front, "rotateY(0)");
            Helper.updateTransformProperty(card.back, "rotateY(180deg)");
        }
    } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
            }
        } finally {
            if (_didIteratorError6) {
                throw _iteratorError6;
            }
        }
    }
}

/**
 * Adds some more CSS and tries to center both front and back in the container
 * @private
 * @param options the options from FlipCard
 */
function _addCssPositioning(options) {
    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = options.domObjects.cardList[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var card = _step7.value;

            // Set container relative
            card.container.style.position = "relative";
            // Get dimensions from front/back
            var frontBounds = card.front.getBoundingClientRect();
            var backBounds = card.back.getBoundingClientRect();
            // Check max width/height and set container accordingly
            var width = Math.max(frontBounds.width, backBounds.width);
            var height = Math.max(frontBounds.height, backBounds.height);
            card.container.style.width = width + "px";
            card.container.style.height = height + "px";
            // Position front and back in container
            card.front.style.position = "absolute";
            card.front.style.top = "50%";
            card.front.style.left = "50%";
            card.front.style.transformOrigin = "left center";
            Helper.updateTransformProperty(card.front, "translate(-50%, -50%)");
            card.back.style.position = "absolute";
            card.back.style.top = "50%";
            card.back.style.left = "50%";
            card.back.style.transformOrigin = "left center";
            Helper.updateTransformProperty(card.back, "translate(-50%, -50%)");
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }
}

return FlipCard;

}());

//# sourceMappingURL=flipcard-oldBrowserSupport.js.map
