# Flip Card JS

Written in ES6 modules :)

## Usage

### Modern Edge, Chrome and Safari
> https://caniuse.com/#feat=es6-module

Import your JS File via:
```javascript
<script type="module" src="script.js"></script>
```

In your JS File:
```javascript
import FlipCard from 'flipcard.js';
 
document.addEventListener("DOMContentLoaded", function(event) {
    let fc = new FlipCard({addCssPositioning: true});
});
```

### Old/current approach
// ToDo

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
var options = {};
let fc = new FlipCard(options);
```

## Options
Default options are:

```javascript
var options = {
  container: ".flip-card",
  front: ".flip-card-front",
  back: ".flip-card-back",
  addCssBasic: true,
  addCssPositioning: false,
  addTouchSupport: true,
  addMouseSupport: true
}
```