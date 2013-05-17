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

            this.notifications = options.notifications;

            // Collection.fetch() will call reset() on success, which
            // in turn will trigger a "reset" event
            this.notifications.on('reset', function() {
                this.render();
            }, this);
        },

        // Provides the view with this collection's data.
        serialize: function() {
            debug.info('Entering Meta.Views.Nav.serialize()...');

            return {
                notifyOnVote: app.feature(3, this.model.id),
                appname: app.name,
                is_authenticated: this.model.get('auth'),
                username: this.model.get('username'),
                numNotifications: this.notifications.length,
                notifications: this.notifications.toJSON()
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