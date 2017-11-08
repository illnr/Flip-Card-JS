export class Card {
    constructor(container, front, back) {
        this.container = container;
        this.front = front;
        this.back = back;
        this.touchSupport = null;
        this._deg = 0;
    }

    get deg(){
        return this._deg;
    }
    set deg(no) {
        this._deg = ((no % 360) + 360) % 360; // https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
    }
}