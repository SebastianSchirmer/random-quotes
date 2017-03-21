var Greeting = (function () {

    'use strict';

    // placeholder for cached DOM elements
    var DOM = {};

    var snippets = [
        'hey lovely',
        'hey handsome',
        'hello beautiful',
        'hello lovely',
        'hello sweetie'
    ];

    var selectedSnippet = selectSnippet();

    /* =================== private methods ================= */

    // cache DOM elements
    function cacheDom() {
        DOM.greeting = document.getElementById('greeting');
    }

    // select a text snippet
    function selectSnippet() {
        var index =  Math.floor(Math.random() * snippets.length);

        return snippets[index];
    }

    // assemble time-based greeting message
    function makeMessage() {
        return selectedSnippet;
    }

    /* =================== public methods ================== */
    function init() {
        cacheDom();
        // renderMessage();
    }

    // render DOM
    function renderMessage() {
        DOM.greeting.innerHTML = makeMessage();
    }

    /* =============== export public methods =============== */
    return {
        init: init,
        renderMessage: renderMessage
    };
}());
