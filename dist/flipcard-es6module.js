const _constants = {
    /**
     * passive option, see:
     * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
     */
    passiveEventOption: function(){
        let passiveSupported = false;
        try {
            let options = Object.defineProperty({}, "passive", {
                get: function() {
                    passiveSupported = true;
                }
            });

            window.addEventListener("test", null, options);
            // console.log("One Time Only :) IIFE");
            return passiveSupported ? { passive: true } : false;
        } catch(err) {
            return false;
        }
    }(),
    /**
     * https://stackoverflow.com/questions/11387805/media-query-to-detect-if-device-is-touchscreen
     * https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
     * Didn't work on my macOS High Sierra 10.13.1 in Chrome 61, but works now in Chrome 62! :)
     */
    isTouchDevice: function(){
        return ('ontouchstart' in window        // works on most browsers
            || navigator.maxTouchPoints         // works on IE10/11 and Surface
        );
    }()
};

class Helper {
    /**
     * Updates the transform property of an element, preserving all other properties.
     * Can apply multiple transforms at once, but not use multiple with matrix and matrix3d! Not working yet!
     * example:
     *     updateTransformProperty(card.back, "rotateY(50deg) skewX(20deg");
     * @param {Element} element the element to update the transform style
     * @param {String} values the value to update the transform style to
     * @return {boolean}
     */
    static updateTransformProperty(element, values) {
        return _updateTransformProperty(element, values);
    }
}

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
    let previousVals = {};
    if (element.style.transform) {
        previousVals = element.style.transform.trim()
            .match(/.+?\(.+?\)/g) // matches a word followed by '(' [...] ')'
            .map(val => val.trim()
                .split(/[()]+/).filter(el => el) // split ([...]) example: ("translate(-50%, -50%)".split(/[()]+/).filter(el => el));
            )
            .reduce((acc, cur) => {acc[cur[0]] = cur[1]; return acc}, {}) // make dict of it: {tranform-func: val}
        ;
    }
    let nextVals = values.trim()
        .match(/.+?\(.+?\)/g) // matches a word followed by '(' [...] ')'
        .map(val => val.trim()
            .split(/[()]+/).filter(el => el) // split ([...]) example: ("translate(-50%, -50%)".split(/[()]+/).filter(el => el));
        )
        .reduce((acc, cur) => {acc[cur[0]] = cur[1]; return acc}, {});
    let updatedVals = Object.assign({}, previousVals, nextVals);
    let updatedValsString = ``;
    for (const key of Object.keys(updatedVals)) {
        updatedValsString += `${key}(${updatedVals[key]}) `;
    }
    updatedValsString.slice(0,-1);
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
class Easing {
    /**
     * Easing function.
     * @param t current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time
     * @param b beginning value of the property
     * @param c change between the beginning and destination value of the property
     * @param d duration / total time of the tween
     * @return {*}
     * @private
     */
    static easeOutElastic(t, b, c, d) {
        let s=1.70158;let p=0;let a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; s=p/4; }
        else s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    }

}

class CardTouchSupport {
    constructor(card) {
        this.card = card;
        this.animTime = 1000;   // time in milliseconds for elastic animation (animateReturnToPlank())
        this.xDown = false;     // point in x-direction of touchevent when touchstartHandler started
        this.isMoving = false;  // touchmoveHandler is currently working
        this.touchStartDeg = 0; // deg when touchstartHandler started
        this.time = 0;          // starting time for elastic animation (animateReturnToPlank())
        this.degGap = 0;        // starting gap to endgoal for elastic animation (animateReturnToPlank())
        this.degStart = 0;      // starting card deg for elastic animation (animateReturnToPlank())
        this.requestAnimationFrameID = 0;   // current requestID of elastic animation (animateReturnToPlank())

        // function expression
        // https://stackoverflow.com/questions/46014034/es6-removeeventlistener-from-arrow-function-oop
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.touchmoveHandler = this.touchmoveHandler.bind(this);
        this.touchendHandler = this.touchendHandler.bind(this);
    }

    touchstartHandler(event) {
        // Cancel current animation
        this.requestAnimationFrameID && window.cancelAnimationFrame(this.requestAnimationFrameID);
        // Use evt.originalEvent.touches instead of evt.touches if you are working with JQuery.
        // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        this.xDown = event.touches[0].clientX;
        this.touchStartDeg = this.card.deg;
        /* ToDo: Bug if only click (tap) with finger it stops working */
    }

    touchmoveHandler(event) {
        if (!this.xDown || this.isMoving) return;
        this.isMoving = true;
        // Use evt.originalEvent.touches instead of evt.touches if you are working with JQuery.
        // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        const xMove = event.touches[0].clientX;
        const xDiff = xMove - this.xDown;
        const xNew = this.touchStartDeg + xDiff;
        Helper.updateTransformProperty(this.card.front, `rotateY(${xNew}deg)`);
        Helper.updateTransformProperty(this.card.back, `rotateY(${xNew+180}deg)`);
        this.card.deg = xNew;
        this.isMoving = false;
    }

    touchendHandler(event) {
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
        this.requestAnimationFrameID = window.requestAnimationFrame((highResTimestamp) => this.animateReturnToPlank(highResTimestamp));
    }

    animateReturnToPlank(currentTime) {
        if ((currentTime - this.time) > this.animTime) { // if run more than animTime(1000ms) - stop
            // this.degGap = 0;
            // this.degStart = 0;
            this.time = 0;
            this.requestAnimationFrameID = 0;
            return;
        }
        // const newDeg = Easing.easeOutElastic(currentTime - this.time, 0, 180, this.animTime);
        const newDeg = Easing.easeOutElastic(currentTime - this.time, this.degStart, this.degGap, this.animTime);

        Helper.updateTransformProperty(this.card.front, `rotateY(${newDeg}deg)`);
        Helper.updateTransformProperty(this.card.back, `rotateY(${newDeg+180}deg)`);

        this.card.deg = newDeg;
        this.requestAnimationFrameID = window.requestAnimationFrame((highResTimestamp) => this.animateReturnToPlank(highResTimestamp));
    }
}

class CardMouseSupport {
    constructor(card) {
        this.card = card;
        this.animTime = 3000;   // time in milliseconds for animation (flip)
        this.time = 0;          // starting time for elastic animation
        this.degGap = 180;        // starting gap to endgoal for elastic animation
        this.degStart = 0;      // starting card deg for elastic animation
        this.requestAnimationFrameID = 0;   // current requestID of elastic animation

        // function expression
        // https://stackoverflow.com/questions/46014034/es6-removeeventlistener-from-arrow-function-oop
        this.mouseenterHandler = this.mouseenterHandler.bind(this);
        this.mouseleaveHandler = this.mouseleaveHandler.bind(this);
    }

    mouseenterHandler(event) {
        // Cancel current animation
        this.requestAnimationFrameID && window.cancelAnimationFrame(this.requestAnimationFrameID);
        this.degStart = this.card.deg;
        this.degGap = 180 - this.card.deg;
        if (this.degGap === 0) return;
        this.time = performance.now();
        // Start animation
        this.requestAnimationFrameID = window.requestAnimationFrame((highResTimestamp) => this.animateFlip(highResTimestamp));
    }

    mouseleaveHandler(event) {
        // Cancel current animation
        this.requestAnimationFrameID && window.cancelAnimationFrame(this.requestAnimationFrameID);
        this.degStart = this.card.deg;
        this.degGap = -this.card.deg;
        if (this.degGap === 0) return;
        this.time = performance.now();
        // Start animation
        this.requestAnimationFrameID = window.requestAnimationFrame((highResTimestamp) => this.animateFlip(highResTimestamp));
    }

    animateFlip(currentTime) {
        if ((currentTime - this.time) > this.animTime) { // if run more than animTime(1000ms) - stop
            // this.degGap = 0;
            // this.degStart = 0;
            this.time = 0;
            this.requestAnimationFrameID = 0;
        }
        // console.log(`Timing: ${currentTime-this.time}, degStart: ${this.degStart}, degGap: ${this.degGap}, animTime: ${this.animTime}`);
        const newDeg = Easing.easeOutElastic(currentTime - this.time, this.degStart, this.degGap, this.animTime);

        Helper.updateTransformProperty(this.card.front, `rotateY(${newDeg}deg)`);
        Helper.updateTransformProperty(this.card.back, `rotateY(${newDeg+180}deg)`);

        this.card.deg = newDeg;
        this.requestAnimationFrameID = window.requestAnimationFrame((highResTimestamp) => this.animateFlip(highResTimestamp));
    }
}

class Card {
    constructor(container, front, back) {
        this.container = container;
        this.front = front;
        this.back = back;
        this.touchSupport = null;
        this.mouseSupport = null;
        this._deg = 0;
    }

    get deg(){
        return this._deg;
    }
    set deg(no) {
        // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
        this._deg = ((no % 360) + 360) % 360;
    }
    
    addTouchSupport() {
        if (this.touchSupport || !_constants.isTouchDevice) return; // ToDo Test
        this.touchSupport = new CardTouchSupport(this);
        this.container.addEventListener('touchstart', this.touchSupport.touchstartHandler,
            _constants.passiveEventOption);
        this.container.addEventListener('touchmove', this.touchSupport.touchmoveHandler,
            _constants.passiveEventOption);
        this.container.addEventListener('touchend', this.touchSupport.touchendHandler,
            _constants.passiveEventOption);
    }
    
    removeTouchSupport() {
        if (!this.touchSupport) return;  // ToDo Test
        this.container.removeEventListener('touchstart', this.touchSupport.touchstartHandler,
            _constants.passiveEventOption);
        this.container.removeEventListener('touchmove', this.touchSupport.touchmoveHandler,
            _constants.passiveEventOption);
        this.container.removeEventListener('touchend', this.touchSupport.touchendHandler,
            _constants.passiveEventOption);
        this.touchSupport = null;
    }

    addMouseSupport() {
        if (this.mouseSupport || _constants.isTouchDevice) return; // ToDo Test
        this.mouseSupport = new CardMouseSupport(this);
        this.container.addEventListener('mouseenter', this.mouseSupport.mouseenterHandler,
            _constants.passiveEventOption);
        this.container.addEventListener('mouseleave', this.mouseSupport.mouseleaveHandler,
            _constants.passiveEventOption);
    }

    removeMouseSupport() {
        if (!this.mouseSupport) return; // ToDo Test
        this.container.removeEventListener('mouseenter', this.mouseSupport.mouseenterHandler,
            _constants.passiveEventOption);
        this.container.removeEventListener('mouseleave', this.mouseSupport.mouseleaveHandler,
            _constants.passiveEventOption);
        this.mouseSupport = null;
    }
}

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
const defaults = {
    container: ".flip-card",
    front: ".flip-card-front",
    back: ".flip-card-back",
    addCssBasic: true,
    addCssPositioning: false,
    addTouchSupport: true,
    addMouseSupport: true,
    domObjects: {
        cardList: []
    },
};


/**
 * THE class all depends on :)
 * You can pass options,
 * @see defaults
 */
class FlipCard {
    constructor(options = {}) {
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
    updateDomObjects() {
        // Check if there are already objects in list
        if (this.options.domObjects.cardList.length === 0) {
            // Iterate over all containers and add them
            let containerList = document.querySelectorAll(this.options.container);
            for (const container of containerList) {
                const front = container.querySelector(this.options.front);
                const back = container.querySelector(this.options.back);

                this.options.domObjects.cardList.push(new Card(container,front,back));
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
    get touchSupport() {
        const _this = this;
        return {
            add() {
                for (const card of _this.options.domObjects.cardList) {
                    card.addTouchSupport();
                }
                return _this;
            },
            remove() {
                for (const card of _this.options.domObjects.cardList) {
                    card.removeTouchSupport();
                }
                return _this;
            }
        }
    }

    /**
     * To enable mouseSupport, you can call your FlipCard.mouseSupport.add();
     * @return functions to call
     */
    get mouseSupport() {
        const _this = this;
        return {
            add() {
                for (const card of _this.options.domObjects.cardList) {
                    card.addMouseSupport();
                }
                return _this;
            },
            remove() {
                for (const card of _this.options.domObjects.cardList) {
                    card.removeMouseSupport();
                }
                return _this;
            }
        }
    }
}

/**
 * Adds the minimal Basic CSS for the Flip Effect
 * @private
 * @param options the options from FlipCard
 */
function _addCssBasic(options) {
    for (const card of options.domObjects.cardList) {
        card.container.style.perspective = "400px";
        card.front.style.backfaceVisibility = "hidden";
        card.back.style.backfaceVisibility = "hidden";
        Helper.updateTransformProperty(card.front, "rotateY(0)");
        Helper.updateTransformProperty(card.back, "rotateY(180deg)");
    }
}

/**
 * Adds some more CSS and tries to center both front and back in the container
 * @private
 * @param options the options from FlipCard
 */
function _addCssPositioning(options) {
    for (const card of options.domObjects.cardList) {
        // Set container relative
        card.container.style.position = "relative";
        // Get dimensions from front/back
        let frontBounds = card.front.getBoundingClientRect();
        let backBounds = card.back.getBoundingClientRect();
        // Check max width/height and set container accordingly
        let width = Math.max(frontBounds.width, backBounds.width);
        let height = Math.max(frontBounds.height, backBounds.height);
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
}

export default FlipCard;

//# sourceMappingURL=flipcard-es6module.js.map
