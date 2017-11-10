import {CardTouchSupport} from "./card-touch-support.js";
import {_constants} from "./helper.js";
import {CardMouseSupport} from "./card-mouse-support.js";

export class Card {
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