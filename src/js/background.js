var Background = (function () {

    'use strict';

    // placeholder for cached DOM elements
    var DOM = {};

    /* =================== private methods ================= */

    // cache DOM elements
    function cacheDom() {
        DOM.background = document.getElementById('background');
    }

    // coordinate async assembly of image element and rendering
    function loadImage() {
        var baseUrl = 'https://source.unsplash.com/category';
        var category = 'nature';
        var size = '1920x1080';

        var source = baseUrl + '/' + category + '/' + size;

        buildElement(source)
            .then(render);
    }

    // assemble the image element
    function buildElement(source) {
        var deferred = $.Deferred(function (task) {

            var image = new Image();

            image.onload = function () {
                task.resolve(image);
            };

            image.onerror = function () {
                task.reject();
            };

            image.src = source;

        });

        return deferred.promise();
    }

    // render DOM
    function render(image) {
        DOM.background.appendChild(image);
        DOM.background.style.opacity = 1;
    }


    /* =================== public methods ================== */
    function init() {
        cacheDom();
        loadImage();
    }

    /* =============== export public methods =============== */
    return {
        init: init
    };
}());
