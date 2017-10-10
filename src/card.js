export class Card {
    constructor(container, front, back, touchSupport=null) {
        this.container = container;
        this.front = front;
        this.back = back;
        this.touchSupport = touchSupport;
        this._deg = 0;
    }

    get deg(){
        return this._deg;
    }
    set deg(no) {
        this._deg = no % 360;
    }
}