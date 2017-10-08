/**
 * https://
 * Flip Card JS
 * @version 0.0.1
 * @author Fabian Wiesner
 * @copyright ⓒ2017 Fabian Wiesner
 * Released under the MIT licence
 */

/**
 *
 * @type {{container: string, front: string, back: string, addCssBasic: boolean}}
 */
const defaults = {
    container: ".flip-card",
    front: ".flip-card-front",
    back: ".flip-card-back",
    addCssBasic: true,
    addCssPositioning: false,
    domObjects: {
        cardList: [
            {
                container: null,
                front: null,
                back: null
            },
        ]
    },
};

/**
 *
 */
export default class FlipCard {
    constructor(options = {}) {
        this.options = Object.assign({}, defaults, options);
        this.updateDomObjects();
        if (this.options.addCssBasic) {
            _addCssBasic(this.options);
        }
        if (this.options.addCssPositioning) {
            _addCssPositioning(this.options);
        }
    }

    /**
     *
     */
    updateDomObjects() {
        // Check if there are already objects in list
        if (this.options.domObjects.cardList[0].container === null) {
            // Remove empty cardList element
            this.options.domObjects.cardList.pop();
            // Iterate over all containers and add them
            let containerList = document.querySelectorAll(this.options.container);
            for (const container of containerList) {
                const front = container.querySelector(this.options.front);
                const back = container.querySelector(this.options.back);

                this.options.domObjects.cardList.push({
                    container: container,
                    front: front,
                    back: back
                });
            }
        } else {
            console.error("ToDo! updateDomObjects()"); // ToDo updateDomObjects - already have some
        }
        return this;
    }
}

/**
 *
 * @param options
 * @private
 */
function _addCssBasic(options) {
    for (const card of options.domObjects.cardList) {
        card.container.style.perspective = "400px";
        card.front.style.backfaceVisibility = "hidden";
        card.back.style.backfaceVisibility = "hidden";
        _updateTransformProperty(card.front, "rotateY(0)");
        _updateTransformProperty(card.back, "rotateY(180deg)");
    }
}

/**
 *
 * @param options
 * @private
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
        _updateTransformProperty(card.front, "translate(-50%, -50%)");
        card.back.style.position = "absolute";
        card.back.style.top = "50%";
        card.back.style.left = "50%";
        _updateTransformProperty(card.back, "translate(-50%, -50%)");
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
        .reduce((acc, cur) => {acc[cur[0]] = cur[1]; return acc}, {}) // make dict of it: {tranform-func: val}
    ;
    let updatedVals = Object.assign({}, previousVals, nextVals);
    let updatedValsString = ``;
    for (const key of Object.keys(updatedVals)) {
        updatedValsString += `${key}(${updatedVals[key]}) `;
    }
    updatedValsString.slice(0,-1);
    element.style.transform = updatedValsString;
    return true;
}