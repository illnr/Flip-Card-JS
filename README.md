# Flip Card JS
A small lib to create a nice flipping card effect, 
that works mobile by paning, and on desktop by hover.

**Demo**:  
https://ibaff.github.io/Flip-Card-JS/demo/main/  
https://ibaff.github.io/Flip-Card-JS/demo/js-module/


Written in ES6 modules :)  
No Dependency, maybe conflict with jQuery, not tested yet.

## Usage

### Modern (Edge, Chrome and Safari)
> https://caniuse.com/#feat=es6-module

Import your JS File in your HTML via:

```javascript
<script type="module" src="script.js"></script>
```

In your JS File:

```javascript
import FlipCard from 'flipcard-es6m.js';
 
document.addEventListener("DOMContentLoaded", function(event) {
    let fc = new FlipCard({addCssPositioning: true});
});
```

### Old/current approach
Import your JS Files in your HTML via:

```javascript
<script src="flipcard.js"></script>
<script src="script.js"></script>
```

In your JS File:

```javascript
document.addEventListener("DOMContentLoaded", function(event) {
    let fc = new FlipCard({addCssPositioning: true});
});
```

### Start using
```javascript
let fc = new FlipCard({addCssPositioning: true});
```

### CSS hint if using `DOMContentLoaded`
Hide the back of a card with opacity: 0.  
ToDo: Add opacity enabler in API

# Card
A card consists of a (one) front and a (one) back, both within a container.

# API
First you need to create an instance of `FlipCard`.

```javascript
const options = {};
let fc = new FlipCard(options);
```

## Options
Default options are:

```javascript
const options = {
  container: ".flip-card",
  front: ".flip-card-front",
  back: ".flip-card-back",
  addCssBasic: true,
  addCssPositioning: false,
  addTouchSupport: true,
  addMouseSupport: true
}
```
