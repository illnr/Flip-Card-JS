import {Easing} from "./easing.js";
import {Helper} from "./helper.js";

export class CardMouseSupport {
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