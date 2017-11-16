import {Helper} from "./helper.js";
import {Easing} from "./easing.js";

export class CardTouchSupport {
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
