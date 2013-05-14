define([
    // Application.
    'app',

    // Libraries
    'backbone',

    // Modules
    'modules/meta',
    'modules/discussion',
    'modules/session',
    'modules/user',

    'debug'
],

function(app, Backbone, Meta, Discussion, Session, User, debug) {

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
            //this.session = new Session.Model();

            // The user model is populated with user data if the
            // user is authenticated.
            this.user = new User.Model();
        },

        subRoutes: {},

        discussion: function(subroute) {
            debug.info('Entering Router.discussion(' + subroute + ')...');
            if (!this.subRoutes.discussion) {
                // Instantiate discussion module specific routes.
                this.subRoutes.discussion = new Discussion.Router('discussions', {user: this.user, createTrailingSlashRoutes: true, trigger: true});
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
                this.subRoutes.user = new User.Router('accounts', {user: this.user, createTrailingSlashRoutes: true, trigger: true});
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