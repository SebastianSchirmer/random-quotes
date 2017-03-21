var Quote = (function () {

    'use strict';

    // placeholder for cached DOM elements
    var DOM = {};

    /* =================== private methods ================= */

    // cache DOM elements
    function cacheDom() {
        DOM.quoteFeature = document.getElementById('quote');
        DOM.quoteLink = document.createElement('a');
        DOM.author = document.createElement('p');
    }

    // get random quote
    function getQuote() {
        var api = {
            endpoint: 'https://quotesondesign.com/wp-json/posts',
            params: {
                'filter[orderby]'       : 'rand',
                'filter[posts_per_page]': 1,
                'cachingHack'           : (new Date()).getTime()
            }
        };

        $.getJSON(api.endpoint, api.params)
            .then(renderQuote)
            .catch(handleError)
    }

    // handle errors
    function handleError(err) {
        console.log(err);
    }

    // render quote
    function renderQuote(response) {
        Greeting.renderMessage();

        DOM.quoteLink.setAttribute('target', '_blank');
        DOM.quoteLink.setAttribute('href', response[0].link);
        DOM.quoteLink.innerHTML = response[0].content;

        DOM.author.innerHTML = response[0].title;

        DOM.quoteFeature.style.backgroundColor = 'rgba(0, 0, 0, .2)';
        DOM.quoteFeature.setAttribute('href', response[0].link);
        DOM.quoteFeature.setAttribute('target', '_blank');
        DOM.quoteFeature.appendChild(DOM.quoteLink);
        DOM.quoteFeature.appendChild(DOM.author);
    }

    /* =================== public methods ================== */
    function init() {
        cacheDom();
        getQuote();
    }

    /* =============== export public methods =============== */
    return {
        init: init
    };
}());
