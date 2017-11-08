import {Helper} from "./helper.js";

export class TouchSupport {
    constructor(card) {
        this.card = card;
        this.xDown = null;
        this.isMoving = false;
        this.touchStartDeg = 0;
        this.time = 0;
        this.degGap = 0;
        this.degStart = 0;
        this.requestAnimationFrameID = 0;
        this.i = 0;
    }

    touchstartHandler(event) {
        // Cancel current animation
        this.requestAnimationFrameID && window.cancelAnimationFrame(this.requestAnimationFrameID);
        // Use evt.originalEvent.touches instead of evt.touches if you are working with JQuery.
        // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        this.xDown = event.touches[0].clientX;
        this.touchStartDeg = this.card.deg;
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
        this.time = performance.now();
        this.degGap = (180 - this.card.deg) < 0 ? (360-this.card.deg) : (180-this.card.deg) ;
        this.degStart = this.card.deg;
        // Start animation
        this.requestAnimationFrameID = window.requestAnimationFrame((highResTimestamp) => this.returnToPlank(highResTimestamp));
    }

    returnToPlank(currentTime) {
        // console.log(this.i);
        if (this.i === 60) {
            this.degGap = 0;
            this.time = 0;
            this.degStart = 0;
            this.requestAnimationFrameID = 0;
            this.i = 0;
            return;
        }
        this.i++;
        // const newDeg = _easeOutElastic(currentTime - this.time, 0, 180, 1000);
        const newDeg = _easeOutElastic(currentTime - this.time, this.degStart, this.degGap, 1000);
        // console.log(newDeg);
        // console.log(performance.now() - this.time);
        Helper.updateTransformProperty(this.card.front, `rotateY(${newDeg}deg)`);
        Helper.updateTransformProperty(this.card.back, `rotateY(${newDeg+180}deg)`);
        // console.log(card.front.style.transform);
        this.card.deg = newDeg;
        this.requestAnimationFrameID = window.requestAnimationFrame((highResTimestamp) => this.returnToPlank(highResTimestamp));
    }
}


/**
 * Easing function. Credits:
 * https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
 * http://robertpenner.com/easing/
 * http://upshots.org/actionscript/jsas-understanding-easing
 * http://sol.gfxile.net/interpolation/
 * @param t current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time
 * @param b beginning value of the property
 * @param c change between the beginning and destination value of the property
 * @param d duration / total time of the tween
 * @return {*}
 * @private
 */
function _easeOutElastic(t, b, c, d) {
    let s=1.70158;let p=0;let a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; s=p/4; }
    else s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
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