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
        console.log(this.options);
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
 */
function _addCssBasic(options) {
    for (const card of options.domObjects.cardList) {
        card.container.style.perspective = "400px";
        card.front.style.backfaceVisibility = "hidden";
        card.back.style.backfaceVisibility = "hidden";
        card.front.style.transform.rotate(0);
        card.back.style.transform.rotate(180);
    }
}

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
        card.front.style.transform = "translate(-50%, -50%)";
        card.back.style.position = "absolute";
        card.back.style.top = "50%";
        card.back.style.left = "50%";
        card.back.style.transform = "translate(-50%, -50%)";
    }
}