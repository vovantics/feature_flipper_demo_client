define([
    // Application.
    'app',

    // Libraries
    'backbone',

    // Modules
    'modules/meta',
    'modules/notification',
    'modules/discussion',
    'modules/session',
    'modules/user',

    'debug',

    // Plugins
    'backbone.routefilter'
],

function(app, Backbone, Meta, Notification, Discussion, Session, User, debug) {

    'use strict';

    // Defining the main router, you can attach sub routers here.
    var Router = Backbone.Router.extend({

        routes: {
            'accounts/*subroute': 'user',
            'discussions/*subroute': 'discussion',
            'sessions/*subroute': 'session',
            '': 'landing'
        },

        initialize: function() {
            debug.info('Entering Router.initialize()...');

            // The session model is used to determine if the user is
            // authenticated or not.
            this.session = new Session.Model();

            // The user model is populated with user data if the
            // user is authenticated.
            this.user = new User.Model();

            // Notifications for current user.
            this.notifications = new Notification.NotificationCollection([]);
        },

        subRoutes: {},

        // This `backbone.routefilter` filter is called
        // before every main router action and gets the session if user is authenticated.
        before: function(route) {
            debug.info('Entering Router.before(' + route + ')...');

            // TODO: Fetch the session and account from the server.
            debug.debug("Fetching the session...");
            //this.session.fetch({async: false});


            // Fetch the session and account from the server.
            var that = this;
            this.session.fetch({
                async: false,
                success: function () {
                    //debug.debug("Got session [" + JSON.stringify(that.session) + "]");
                    if (that.session.isAuthenticated()) {
                        //that.account.set( { id: that.session.id } );
                        debug.debug("Authenticated! Fetching notifications user id=[" + that.session.id + "]");
                        //this.notifications.fetch({ async: false, data: $.param({user_to: this.session.id}) });
                        this.notifications.fetch({
                            async: false,
                            data: $.param({user_to: that.session.id}),
                            success: function (model, response, options) {
                                debug.debug("Fetch notifications success!");    
                            },
                            error: function(model, response, options) {
                                debug.debug("Fetch notifications ERROR!");    
                                console.log(response);
                            }
                        });

                        setInterval(function () {
                            debug.info("Fetching notifications from the server...");
                            that.notifications.fetch({ async: false, reset: true, data: $.param({user_to: that.session.id}) });
                        }, 10000);
                    }
                    else {
                        debug.debug("Not authenticated!");
                        that.session.set({id: 3, auth: true, username: 'stevo'});   // TODO: *****************
                    }
                },
                error: function () {
                    debug.debug("SOMETHING HAPPENED! CAN'T TELL IF USER'S LOGGED IN OR NOT!!!")
                }
            });

            // Fetch the status of feature flags.
            app.feature(1, this.session.id).fetch({async: false});
            app.feature(2, this.session.id).fetch();
            app.feature(3, this.session.id).fetch({async: false});
            //app.feature(4, 1).fetch();
            debug.info('Is feature 1 on? [' + app.feature(1, 1).isOn() + ']');
            debug.info('Is feature 2 on? [' + app.feature(2, 1).isOn() + ']');
            debug.info('Is feature 3 on? [' + app.feature(3, 1).isOn() + ']');
        },

        discussion: function(subroute) {
            debug.info('Entering Router.discussion(' + subroute + ')...');
            if (!this.subRoutes.discussion) {
                // Instantiate discussion module specific routes.
                this.subRoutes.discussion = new Discussion.Router('discussions', {session: this.session, user: this.user, notifications: this.notifications, createTrailingSlashRoutes: true, trigger: true});
            }
        },

        session: function(subroute) {
            debug.info('Entering Router.session(' + subroute + ')...');
            if (!this.subRoutes.session) {
                // Instantiate session module specific routes.
                this.subRoutes.session = new Session.Router('sessions', {session: this.session, createTrailingSlashRoutes: true, trigger: true});
            }
        },

        user: function(subroute) {
            debug.info('Entering Router.user(' + subroute + ')...');
            if (!this.subRoutes.user) {
                // Instantiate user module specific routes.
                this.subRoutes.user = new User.Router('accounts', {session: this.session, createTrailingSlashRoutes: true, trigger: true});
            }
        },

        home: function() {
            debug.info('Entering Router.home()...');

            // Set layout and views, then render.
            app.useLayout('onecolumn').setViews({
                '#container-nav': new Meta.Views.Nav(),
                '#container-content': new Discussion.Views.List({
                    model: this.user,
                    //session: this.session
                })
            }).render();
        },

        landing: function() {
            debug.info('Entering Router.landing()...');

            app.useLayout('splash').setViews({
                '#container-content': new Meta.Views.Landing()
            }).render();
        },

    });

    return Router;
});