define([
    // Application.
    'app',

    // Libs
    'jquery',
    'underscore',
    'backbone',
    'debug',

    'backbone.subroute',
    'backbone.oauth'
],
function(app, $, _, Backbone, debug) {

    'use strict';

    var Session = app.module();

    // Session Router
    // --------------

    Session.Router = Backbone.SubRoute.extend({

        routes: {
            'login?next=:next': 'login',
            'login': 'login'
        },

        initialize: function(options) {
            debug.info('Entering Session.Router.initialize()...');

            this.session = options.session;
        },

        login: function(next) {
            debug.info('Entering Session.Router.login(' + next + ')...');

            // Use layout and views, and then render.
            app.useLayout('auth').setViews({
                '#container-content': new Session.Views.Login({
                    model: this.session,
                    next: next !== undefined ? decodeURIComponent(next) : null
                })
            }).render();
        }

    });

    // Session Model
    // -------------

    Session.Model = Backbone.Model.extend({

        urlRoot: 'http://' + app.serverHost + '/api/session/',

        // Default attributes for the session.
        defaults: {
            auth: false,
        },

        initialize: function() {
            debug.info('Entering Session.Model.initialize()...');

            Backbone.Model.prototype.initialize.call(this);
        },

        isAuthenticated: function() {
            return this.get('auth');
        }
    });

    // Session Views
    // -------------

    Session.Views.Login = Backbone.View.extend({
        template: 'session/login',

        tagName: 'div id="session-login-outer"',

        // Delegated events for creating new items.
        events: {
            'submit form#form-session-login':       'createOnSubmit',
            'click #connect-facebook':       'connectOnSubmit'
        },

        initialize: function(options) {
            debug.info('Entering Views.Login.initialize()...');

            this.next = options.next;
        },

        createOnSubmit: function(e) {
            debug.info('Entering Views.Login.createOnSubmit()...');

            // Cancel default action of the keypress event.
            e.preventDefault();

            var data = {
                email: $('#email').val(),
                password: $('#password').val()
            };

            debug.debug('Session before save cid=[' + this.model.cid + '] model=[' + JSON.stringify(this.model) + ']');
            var that = this;
            this.model.save(data, {
                success: function(model, response, options){
                    if (response.auth === true) {
                        debug.debug('Authenticated!');
                        app.router.navigate('discussions/', {trigger: true});
                    }
                    else {
                        debug.debug('NOT Authenticated!');
                    }
                },
                error: function(model, response, options) {
                    debug.debug('An error has occurred while signing in.');
                },
                emulateJSON: false
            });

        },

        serialize: function() {
            debug.info('Entering Views.Login.serialize()...');

            return {
                featSocialConnect: app.feature(4)   // TODO
            };
        }
    });

    return Session;

});