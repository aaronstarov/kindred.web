Below is the same very, *very* simple reactive application written in both Kindred and Meteor, which I'd consider Kindred's most elegant rival (and primary inspiration).

The app behaves as follows:

- When users type input into a text box, the corresponding `keycode` of each key stroke is displayed next to it, and
- when users press a button, the number next to it (originally set to 0) is incremeneted.

In **Meteor**, the app is defined in two files, a template file and corresponding javascript:

*client/numbers.html*
```html
<body>
    {{> numbers}}
</body>

<template name="numbers">
    <span class="keycode">{{keycode}}</div>
    <input class="keycode" placeholder="Enter text" />
    <span class="num">{{num}}</div>  
    <button class="increment">Increment</button>
</template>
```

*client/numbers.js*
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

In **Kindred**, the same app can be written:

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
};
Kindred.present(numbers, Kindred.root);
```

The result of `Kindred.present(numbers, document.getElementById("example2"))` is:

<div id="example2"></div>


There are significant advantages to the Kindred framework:

- reduction of code size by ~⅓
- fewer concepts/APIs (no templates, no Session variable to trigger reactivity)
- simpler modularity through pure javascript
- objects & renderers more easily shared across projects

The advantages that show themselves in this trivial example only grow in more complex projects, where the consistency and maleability of the code base can greatly impact how long it takes to make changes. 

[TODO: the state of objects should persist past page refreshes -- this will require hooking it up to peer-to-peer network.]
