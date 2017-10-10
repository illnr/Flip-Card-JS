import {Helper} from "./helper.js";

export class TouchSupport {
    constructor() {
        this.xDown = null;
        this.isMoving = false;
        this.touchStartDeg = 0;
    }

    touchstartHandler(event, card) {
        // Use evt.originalEvent.touches instead of evt.touches if you are working with JQuery.
        // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        this.xDown = event.touches[0].clientX;
        this.touchStartDeg = card.deg;
    }

    touchmoveHandler(event, card) {
        if (!this.xDown || this.isMoving) return;
        this.isMoving = true;
        // Use evt.originalEvent.touches instead of evt.touches if you are working with JQuery.
        // https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        const xMove = event.touches[0].clientX;
        const xDiff = xMove - this.xDown;
        const xNew = this.touchStartDeg + xDiff;
        Helper.updateTransformProperty(card.front, `rotateY(${xNew}deg)`);
        Helper.updateTransformProperty(card.back, `rotateY(${xNew+180}deg)`);
        card.deg = xNew;
        this.isMoving = false;
    }

    touchendHandler(event, card) {
        this.xDown = null;
    }
}


/**
 * Easing function. Credits:
 * https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
 * http://robertpenner.com/easing/
 * http://upshots.org/actionscript/jsas-understanding-easing
 * http://sol.gfxile.net/interpolation/
 * @param x
 * @param t current time
 * @param b begInnIng value
 * @param c change In value
 * @param d duration
 * @return {*}
 * @private
 */
function _easeOutElastic(x, t, b, c, d) {
    let s=1.70158;let p=0;let a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; let s=p/4; }
    else let s = p/(2*Math.PI) * Math.asin (c/a);
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