Below is the same very, *very* simple reactive application written in Kindred and Meteor, which I'd consider Kindred's most elegant rival.

In Meteor, the app is defined in two files, a template file and corresponding javascript:

**client/numbers.js**
```javascript
Session.setDefault('counter', 0);

Template.numbers.helpers({
    num: function () {
        return Session.get('counter');
    },
    keycode: function () {
        return Session.get('keycode');
    },
});

Template.numbers.events({
    'click button': function () {
        Session.set('counter', Session.get('counter') + 1);
    },
    'keydown input': function (e) {
        Session.set('keycode', e.keyCode);
    },
});
``` 

**client/numbers.html**
```html
<body>
    {{> numbers}}
</body>

<template name="numbers">
    <div class="keycode">{{keycode}}</div>
    <input class="keycode" placeholder="Enter text" />
    <div class="num">{{num}}</div>  
    <button class="increment">Increment</button>
</template>
```

In Kindred, the same app can be written:

```javascript
var numbers = {
    keycode: null,
    keycode_input: {
        html: "input",
        attr: {
            placeholder: "Enter text",
        },
        onkeydown: function(e) {
            this.keycode = e.keyCode;
        },
    },
    num: 0,
    increment: {
        html: "button",
        innerHTML: "Increment",
        onclick: function() {
            this.num++;
        },
    },
}
Kindred.present(numbers, Kindred.root);
```

There are significant advantages to the Kindred framework:

- reduction of code size by ~1/3
- fewer concepts/APIs (no templates, no Session variable to trigger reactivity)
- simpler modularity through pure javascript
- objects & renderers more easily shared across projects

The advantages that show themselves in this trivial example only grow in more complex projects, where the consistency and maleability of the code base greatly impact how long it takes to make changes. 
