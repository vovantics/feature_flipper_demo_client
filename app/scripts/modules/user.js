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
    //app.feature(1).turnOff();
    //app.feature(2).turnOn();
    //console.log("Fetching feature 1...");
    //app.feature(1, 1).fetch();
    /*app.feature(1, 1).fetch({
        async: false,
        success: function (model, response, options) {
            debug.debug("Fetch success!");    
        },
        error: function(model, response, options) {
            debug.debug("Fetch ERROR!");    
            console.log(response);
        }
    });*/

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
            this.session = options.session;
        },

        register: function() {
            debug.info('Entering User.Router.register()...');

            // Set layout and views, then render.
            app.useLayout('auth').setViews({
                '#container-content': new User.Views.Register({
                    //model: this.user
                    session: this.session
                })
            }).render();
        },

        payup: function() {
            debug.info('Entering User.Router.payup()...');

            // Set layout and views, then render.
            app.useLayout('auth').setViews({
                '#container-content': new User.Views.PayUp({
                    //model: this.user
                })
            }).render();
        }
    });

    // User Model
    // -------------

    User.Model = Backbone.Model.extend({

        //url: 'http://' + app.serverHost + '/user/',

        initialize: function() {
            debug.info('Entering User.Model.initialize()...');

            Backbone.Model.prototype.initialize.call(this);
        },

        // The callback function that is called when this model's data
        // is returned by the server, in fetch, and save. Returns the
        // attributes hash to be set on the model
        parse: function(response) {
            debug.info('Entering User.Model.parse()...');

            debug.debug('User model response = [' + JSON.stringify(response) + ']');
            debug.debug('User model username = [' + response.username + ']');

            return {
                //id: response.id,
                date_joined: response.date_joined,
                email: response.email,
                first_name: response.first_name,
                username: response.username/*
                is_active: true
                is_staff: true
                is_superuser: true
                last_login: 2013-05-15T10:07:29.531329
                last_name:
                password: pbkdf2_sha256$10000$ZOGVnmkYLFIT$WT5eCORXkInDzsvSjHr7TbQ1mjzE8vSlTR1IohvR3ME=
                resource_uri: /api/user/1/
                username: root*/
            };
        }
    });

    // User Collection
    // ---------------

    User.Collection = Backbone.Collection.extend({

        url: 'http://' + app.serverHost + '/api/user/?format=json',

        // Reference to this collection's model.
        model: User.Model,

        parse: function(response) {
            debug.info('Entering User.Collection.parse()...');

            return response.objects;
        }

    });

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
        },

        createUserOnSubmit: function(e) {
            debug.info('Entering User.Views.PasswordReset.createUserOnSubmit()...');

            // Cancel default action of the keypress event.
            e.preventDefault();

            app.feature(1, this.session.id).whenOn(function() {
                app.router.navigate('accounts/register/payup/', {trigger: true, replace: true});
            }, this);

            app.feature(1, this.session.id).whenOff(function() {
                app.router.navigate('discussions/', {trigger: true, replace: true});
            }, this);
        },

        serialize: function() {
            debug.info('Entering User.Views.Register.serialize()...');
        }
    });

    return User;
});