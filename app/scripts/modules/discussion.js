define([
    // Application.
    'app',

    // Libraries
    'backbone',
    'debug',

    // Modules
    'modules/meta',

    'backbone.subroute'
],
function(app, Backbone, debug, Meta) {
    'use strict';
    var Discussion = app.module();

    // Discussion Router
    // -----------------

    Discussion.Router = Backbone.SubRoute.extend({

        routes: {
            '': 'list',             // #questions/
        },

        list: function() {
            debug.info('Entering Discussion.Router.list()...');

            // Set layout and views, then render.
            app.useLayout('onecolumn').setViews({
                '#container-nav': new Meta.Views.Nav(),
                '#container-content': new Discussion.Views.List({
                    model: this.user
                    //session: this.session
                })
            }).render();
        }
    });

    // Discussion Views
    // ----------------

    Discussion.Views.List = Backbone.View.extend({
        template: 'discussion/list',

        // Delegated events for creating new items.
        events: {
        },

        initialize: function() {
            debug.info('Entering Discussion.Views.List.initialize()...');
        },

        serialize: function() {
            debug.info('Entering Discussion.Views.List.serialize()...');

            // TODO: For FB login
            // var hash = window.location.hash;window.close();opener.OAuthRedirect(hash);
        }
    });

    return Discussion;
});