define([
    // Application.
    'app',

    // Libraries
    'jquery',
    'underscore',
    'backbone',
    'debug',

    // Modules

    'backbone.subroute'

],
function(app, $, _, Backbone, debug) {

    'use strict';

    // Edit these and turn them on or off
    //app.feature(1).turnOn();
    app.feature(2).turnOn();
    app.feature(1, 1).fetch();

    var User = app.module();

    User.Router = Backbone.SubRoute.extend({

        routes: {
            'register': 'register',             // #accounts/register
            'register/payup': 'payup',             // #accounts/edit
            ':username': 'profile'      // #accounts/<username>
        },

        initialize: function(options) {
            debug.info('Entering User.Router.initialize()...');

            //this.user = options.user;
        },

        register: function() {
            debug.info('Entering User.Router.register()...');

            // Set layout and views, then render.
            app.useLayout('splash').setViews({
                '#container-content': new User.Views.Register({
                    //model: this.user
                })
            }).render();
        },

        payup: function() {
            debug.info('Entering User.Router.payup()...');

            // Set layout and views, then render.
            app.useLayout('splash').setViews({
                '#container-content': new User.Views.PayUp({
                    //model: this.user
                })
            }).render();
        }
    });

    // User Model
    // -------------

    User.Model = Backbone.Model.extend({

        urlRoot: 'http://' + app.serverHost + '/users/',

        initialize: function() {
            debug.info('Entering User.Model.initialize()...');

            Backbone.Model.prototype.initialize.call(this);
        },

        // The callback function that is called when this model's data
        // is returned by the server, in fetch, and save. Returns the
        // attributes hash to be set on the model
        parse: function(response) {
            debug.info('Entering User.Model.parse()...');

            if (response.status === 'success') {
                debug.debug('User model response success [' + JSON.stringify(response) + ']');
                return response.data;
            }
            else {
                debug.debug('User model response error/fail [' + JSON.stringify(response) + ']');
                return false;
            }
        }
    });

    // User Collection
    // ---------------

    User.List = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: User.Model

    });

    app.feature('1').whenOn( function() {

        User.Views.PayUp = Backbone.View.extend({
            template: 'user/payup',

            tagName: 'div id="user-register-outer" class="animated bounceInRight"',

            // Delegated events for creating new items.
            events: {
                'submit form#form-user-payup': 'createUserOnSubmit'
            },

            initialize: function(options) {
                debug.info('Entering User.Views.PayUp.initialize()...');
            },

            serialize: function() {
                debug.info('Entering User.Views.PayUp.serialize()...');
            },

            createUserOnSubmit: function(e) {
                debug.info('Entering User.Views.PayUp.createUserOnSubmit()...');

                // Cancel default action of the keypress event.
                e.preventDefault();

                app.router.navigate('discussions/', {trigger: true, replace: true});
            }
        });
    });

    User.Views.Register = Backbone.View.extend({
        template: 'user/register',

        tagName: 'div id="user-register-outer" class="animated fadeInRight"',

        // Delegated events for creating new items.
        events: {
            'submit form#form-user-register': 'createUserOnSubmit'
        },

        initialize: function(options) {
            debug.info('Entering User.Views.Register.initialize()...');

            this.session = options.session;
            this.alerts = options.alerts;
        },

        createUserOnSubmit: function(e) {
            debug.info('Entering User.Views.PasswordReset.createUserOnSubmit()...');

            // Cancel default action of the keypress event.
            e.preventDefault();

            app.feature(1).whenOn(function() {
                app.router.navigate('accounts/register/payup/', {trigger: true, replace: true});
            }, this);

            app.feature(1).whenOff(function() {
                app.router.navigate('discussions/', {trigger: true, replace: true});
            }, this);
        },

        serialize: function() {
            debug.info('Entering User.Views.Register.serialize()...');
        }
    });

    return User;
});