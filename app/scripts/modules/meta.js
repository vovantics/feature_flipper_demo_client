define([
    // Application.
    'app',

    // Libraries
    'backbone',
    'debug'
],
function(app, Backbone, debug) {
    'use strict';
    var Meta = app.module();

    Meta.Views.Nav = Backbone.View.extend({
        template: 'meta/nav',

        // Delegated events for nav controls.
        events: {
            //'click #logout':        'logoutOnClick'
        },

        initialize: function(options) {
            debug.info('Entering Meta.Views.Nav.initialize()...');

            // Re-render the nav when the session is destroyed.
            /*this.model.on("destroy", function() {
                debug.debug("Session destroyed cid=[" + this.model.cid + "] model=[" + JSON.stringify(this.model) + "]");
                this.render();
            }, this);*/
        },

        // Provides the view with this collection's data.
        serialize: function() {
            debug.info('Entering Meta.Views.Nav.serialize()...');

            return {
                appname: app.name
                //is_authenticated: this.model.get('auth'),
                //username: this.model.get('username')
            };
        }
    });

    Meta.Views.Landing = Backbone.View.extend({
        template: 'meta/landing',

        initialize: function() {
            debug.info('Entering Meta.Views.Landing.initialize()...');
        }
    });

    return Meta;
});