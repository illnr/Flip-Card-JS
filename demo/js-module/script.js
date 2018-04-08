// import FlipCard from '../../src/flipcard.js';    // using original src is also working !! :)
import FlipCard from '../../dist/flipcard-es6m.js'; // using bundled file

document.addEventListener("DOMContentLoaded", function(event) {
    let fc = new FlipCard({addCssPositioning: true});
});
