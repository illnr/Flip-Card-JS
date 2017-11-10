export const _constants = {
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

export class Helper {
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