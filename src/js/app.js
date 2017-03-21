(function () {
    // ready
    var readyCallback = function () {
        initModules();
    };

    if (document.readyState === 'complete'
        || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        readyCallback();
    } else {
        document.addEventListener('DOMContentLoaded', readyCallback);
    }

    function initModules() {
        Background.init();
        Greeting.init();
        Quote.init();
    }
})();
