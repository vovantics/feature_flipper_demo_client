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

        urlRoot: 'http://' + app.serverHost + '/session/',

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

        authoriseAndSyncUser: function(loggedInUser) {
            debug.info('Entering Session.Views.Login.authoriseAndSyncUser()...');

            //var users = new UserDetails();
            //users.reset();
            //app.appUser = loggedInUser;
            //app.appUser.save();
            //users.create(loggedInUser);
            //app.navigate("#/settings");
            app.router.navigate('discussions/', {trigger: true, replace: true});
        },

        connectOnSubmit: function(e) {
            debug.info('Entering Session.Views.Login.connectOnSubmit()...');

            // Cancel default action of the keypress event.
            e.preventDefault();

            var self = this;
            // Configurate the Facebook OAuth settings.
            _.extend(Backbone.OAuth.configs.Facebook, {
                client_id: '130192300511743',
                redirect_url: window.location.protocol + '//' + window.location.host + '/#discussions/',
                //redirect_url: window.location.protocoll + '//' + window.location.host + '/auth_redirect.html',

                // Called after successful authentication.
                onSuccess: function(params) {
                    debug.info("FB login success.");
                    console.log('FB ' + params.access_token);

                    // Get the user's data from Facebook's graph api.
                    $.ajax('https://graph.facebook.com/me?access_token=' + params.access_token, {
                        success: function(data) {
                            alert('Howdy, ' + data.name);
                            self.authoriseAndSyncUser({
                                thirdPartyId:data.id,
                                name:data.name,
                                email:data.email,
                                thumbnailPath:data.picture,
                                authenticated:true
                            });
                        }
                    });
                },

                // Called after successful authentication.
                onError: function(params) {
                    debug.error("An error has occurred during FB login.");
                }
            });

            // Create a new OAuth object and call the auth() method to start the process.
            var FB = new Backbone.OAuth(Backbone.OAuth.configs.Facebook);
            FB.auth();
        },

        serialize: function() {
            debug.info('Entering Views.Login.serialize()...');

            return {
                featSocialConnect: app.feature(2)
            };
        }
    });

    return Session;

});