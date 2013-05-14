define([
    // Application.
    'app',

    // Libraries
    'backbone',
    'debug',

    // Modules
    'modules/meta',
    'modules/helpers',

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

        initialize: function() {
            debug.info('Entering Discussion.Router.initialize()...');

            // Create a new Todo List.
            this.answers = new Discussion.AnswerCollection({ namespace: 'q1_answers' });
            var answer1 = new Discussion.AnswerModel({text: 'Corn on the cob.', userName: 'Stevo'});
            var answer2 = new Discussion.AnswerModel({text: 'Beercan chicken.', userName: 'Davin'});
            this.answers.add(answer1);
            this.answers.add(answer2);

            // Fetch any preexisting answers that might be saved in *localStorage*
            //this.list.fetch();
        },

        list: function() {
            debug.info('Entering Discussion.Router.list()...');

            // Set layout and views, then render.
            app.useLayout('onecolumn').setViews({
                '#container-nav': new Meta.Views.Nav(),
                '#container-content': new Discussion.Views.List({
                    model: this.user,
                    answers: this.answers
                    //session: this.session
                })
            }).render();
        }
    });

    // Answer Model
    // ------------

    // The Answer model.
    Discussion.AnswerModel = Backbone.Model.extend({

        // Default attributes for an answer.
        defaults: {
            text: '',
            userName: null
        }

        // Remove this Todo from *localStorage*.
        /*clear: function() {
            this.destroy();
        },*/
    });


    // Answer Collection
    // -----------------

    // The collection of answers.
    Discussion.AnswerCollection = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Discussion.AnswerModel,

        initialize: function(options) {
            // Save all of the answer items under namespace.
            //this.localStorage = new Store(options.namespace);
        }

    });


    // Discussion Views
    // ----------------

    Discussion.Views.List = Backbone.View.extend({
        template: 'discussion/list',

        // Delegated events for creating new items.
        events: {
        },

        initialize: function(options) {
            debug.info('Entering Discussion.Views.List.initialize()...');
            this.answers = options.answers;
        },

        serialize: function() {
            debug.info('Entering Discussion.Views.List.serialize()...');

            // TODO: For FB login
            // var hash = window.location.hash;window.close();opener.OAuthRedirect(hash);

            debug.debug('this.answers ...');
            debug.debug(this.answers);

            var food = [
                {text: "Chicken", userName: "Katz"},
                {text: "Beef", userName: "Lerche"},
                {text: "Steak", userName: "Johnson"}
            ]

            return {
                answers: food   //this.answers
            };
        }
    });

    return Discussion;
});