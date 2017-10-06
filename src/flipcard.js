const defaults = {
    container: ".flip-card",
    front: ".flip-card-front",
    back: ".flip-card-back",
    addBasicCss: false,
};

export default class FlipCard {
    constructor(options = {}) {
        this.options = Object.assign({}, defaults, options);
        if (this.options.addBasicCss) {
            addBasicCss(this.options);
        }
        console.log(this.options);
    }
}

function addBasicCss(options) {
        let containerList = document.querySelectorAll(options.container);
        for (const container of containerList) {
            container.style.position = "relative";
            container.style.backgroundColor = 'red';
        }
}

function test() {
    console.log("test");
}