export class Helper {
    static updateTransformProperty(element, values) {
        _updateTransformProperty(element, values);
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