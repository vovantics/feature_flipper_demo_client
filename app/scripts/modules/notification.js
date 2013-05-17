define([
    // Application.
    'app',

    // Libraries
    'backbone',
    'debug'
],
function(app, Backbone, debug) {

    'use strict';

    var Notification = app.module();

    // Notification Model
    // ------------------

    Notification.NotificationModel = Backbone.Model.extend({

        // Default attributes for a notification.
        defaults: {
            message: '',
            user_from: null,
            user_to: null
        },

        parse: function(response) {
            debug.info('Entering Notification.NotificationModel.parse()...');

            return {
                id: response.id,
                message: response.message,
                user_from: response.user_from.match(/\/api\/user\/(.*)\//)[1],
                user_to: response.user_to.match(/\/api\/user\/(.*)\//)[1],
                timestamp: response.timestamp
            };
        },

        initialize: function() {
            debug.info('Entering Notification.NotificationModel.initialize()...');
        }
    });

    // Notification Collection
    // -----------------------

    Notification.NotificationCollection = Backbone.Collection.extend({

        url: 'http://' + app.serverHost + '/api/notification/',

        // Reference to this collection's model.
        model: Notification.NotificationModel,

        parse: function(response) {
            debug.info('Entering Notification.NotificationCollection.parse()...');

            return response.objects;
        },

        initialize: function() {
            debug.info('Entering Notification.NotificationCollection.initialize()...');
        }

    });

    return Notification;
});