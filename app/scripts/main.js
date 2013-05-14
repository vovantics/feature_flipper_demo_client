require.config({
    paths: {
        backbone: '../components/backbone/backbone',
        'backbone.subroute': '../components/backbone.subroute/backbone.subroute',
        jquery: '../components/jquery/jquery',
        'backbone.layoutmanager': '../components/layoutmanager/backbone.layoutmanager',
        underscore: '../components/underscore/underscore',
        handlebars: '../components/handlebars.js/handlebars',
        moment: '../components/moment/moment',
        bootstrap: 'vendor/bootstrap',
        'backbone.featureflipper': 'vendor/backbone.featureflipper',
        debug: 'vendor/ba-debug.min',
        'backbone.oauth': 'vendor/backbone.oauth'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        debug: {
            exports: 'debug'
        },
        'backbone.layoutmanager': {
            deps: [
                'jquery',
                'backbone',
                'underscore'
            ],
            exports: 'Backbone.LayoutManager'
        },
        'backbone.subroute': {
            deps: ['backbone', 'underscore'],
            exports: 'Backbone.SubRoute'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'backbone.featureflipper': {
            deps: [
                'jquery',
                'backbone',
                'underscore'
            ]
        },
        'backbone.oauth' : ['backbone']
    }
});

require([
    // Application.
    'app',

    // Main Router.
    'router',

    // Libraries.
    'jquery',
    'debug',
    'bootstrap'
],
function (app, Router, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);

    // Set a minimum or maximum logging level for the console.
    // log (1) < debug (2) < info (3) < warn (4) < error (5)
    debug.setLevel(5);

    // Inst main router.
    app.router = new Router();

    Backbone.history.start({ pushState: false });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router. If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on('click', 'a:not([data-bypass])', function(evt) {
        // Get the anchor href and protcol
        var href = $(this).attr('href');
        var protocol = this.protocol + '//';

        // Ensure the protocol is not part of URL, meaning its relative.
        if (href && href.slice(0, protocol.length) !== protocol &&
            href.indexOf('javascript:') !== 0) {
            // Stop the default event to ensure the link will not cause a page
            // refresh.
            evt.preventDefault();

            // `Backbone.history.navigate` is sufficient for all Routers and will
            // trigger the correct events. The Router's internal `navigate` method
            // calls this anyways.
            Backbone.history.navigate(href, true);
        }
    });
});