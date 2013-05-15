define([
    // Application.
    'app',

    // Libraries
    'backbone',
    'debug',

    // Modules
    'modules/meta',
    'modules/constants',
    'modules/helpers',

    'backbone.subroute'
],
function(app, Backbone, debug, Meta, Constants) {
    'use strict';
    var Discussion = app.module();

    // Discussion Router
    // -----------------

    Discussion.Router = Backbone.SubRoute.extend({

        routes: {
            '': 'list',             // #discussions/
            ':id': 'show',          // #discussions/1/
        },

        initialize: function() {
            debug.info('Entering Discussion.Router.initialize()...');

            // Create a new discussion.        
            this.answers = new Discussion.AnswerCollection([], { namespace: 'q1_answers' });
            var answer1 = new Discussion.AnswerModel({text: 'Corn on the cob.', username: 'Stevo'});
            var answer2 = new Discussion.AnswerModel({text: 'Beercan chicken.', username: 'Davin'});
            this.answers.add(answer1);
            this.answers.add(answer2);

            this.questions = new Discussion.QuestionCollection([], { namespace: 'q1_questions' });

            // Fetch any preexisting questions from the server.
            this.questions.fetch({
                async: false,
                success: function (model, response, options) {  // TODO: Fix this
                    debug.debug("XXX Questions fetch success!");    
                },
                error: function(model, response, options) {
                    debug.debug("XXX Questions fetch ERROR!");  // TODO: Fix this    
                    console.log(response);
                }
            });

            /*var question1 = new Discussion.QuestionModel({id: 1, text: 'What is your favourite thing to BBQ?', username: 'Professor'});
            question1.set({'answers': answers});
            var question2 = new Discussion.QuestionModel({id: 2, text: 'Who do you think will win the 2013 World Cup?', username: 'Professor'});
            var question3 = new Discussion.QuestionModel({id: 3, text: 'Why is there not enough breakfast sandwiches served in the morning?', username: 'Professor'});
            var question4 = new Discussion.QuestionModel({id: 4, text: 'List all the cities where Top Hat employees reside.', username: 'Professor'});
            this.questions.add(question1);
            this.questions.add(question2);
            this.questions.add(question3);
            this.questions.add(question4);*/
        },

        show: function(id) {
            debug.info('Entering Discussion.Router.show()...');

            var question = this.questions.get(id);
            var answers = question.get('answers');
            console.log('Question = [' + question.get('text') + ']');

            // Set layout and views, then render.
            app.useLayout('onecolumn').setViews({
                '#container-nav': new Meta.Views.Nav(),
                '#container-content': new Discussion.Views.Show({
                    //session: this.session
                    model: this.user,
                    question: question.get('text'),
                    collection: this.answers
                })
            }).render();
        },

        list: function() {
            debug.info('Entering Discussion.Router.list()...');

            console.log("Passing [" + this.questions.length + '] questions to discussion view...');
            console.log(this.questions.toJSON());

            // Set layout and views, then render.
            app.useLayout('onecolumn').setViews({
                '#container-nav': new Meta.Views.Nav(),
                '#container-content': new Discussion.Views.List({
                    model: this.user,
                    questions: this.questions
                    //session: this.session
                })
            }).render();
        }
    });

    // Question Model
    // ------------

    Discussion.QuestionModel = Backbone.Model.extend({

        //url: 'http://' + app.serverHost + '/api/question/',

        // Default attributes for a question.
        defaults: {
            text: '',
            username: null
        },

        parse: function(response) {
            debug.info('Entering Discussion.QuestionModel.parse()...');
            console.log(response);
            return {
                id: response.id,
                text: response.question
            };
        },

        initialize: function(options) {
            debug.info('Entering Discussion.QuestionModel.initialize()...');
            this.answers = options.answers;
        }
    });

    // Question Collection
    // -------------------

    Discussion.QuestionCollection = Backbone.Collection.extend({

        url: 'http://' + app.serverHost + '/api/question/?format=json',

        // Reference to this collection's model.
        model: Discussion.QuestionModel,

        parse: function(response) {
            debug.info('Entering Discussion.QuestionCollection.parse()...');
            console.log('Discussion.QuestionCollection parse() got ' + response.meta.total_count + ' objects...');
            console.log(response.objects);
            return response.objects;
        },

        initialize: function() {
            debug.info('Entering Discussion.QuestionCollection.initialize()...');
            // Save all of the question items under namespace.
            //this.localStorage = new Store(options.namespace);
        }

    });

    // Answer Model
    // ------------

    Discussion.AnswerModel = Backbone.Model.extend({

        url: 'http://' + app.serverHost + '/api/answer/',

        // Default attributes for an answer.
        defaults: {
            text: '',
            username: null
        }
    });


    // Answer Collection
    // -----------------

    Discussion.AnswerCollection = Backbone.Collection.extend({

        // Reference to this collection's model.
        model: Discussion.AnswerModel,

        initialize: function(options) {
            // Save all of the answer items under namespace.
            //this.localStorage = new Store(options.namespace);
        },

        // We keep the Answers in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
            if ( !this.length ) {
                return 1;
            }
            return this.last().get('order') + 1;
        }

        // Answers are sorted by their original insertion order.
        /*comparator: function( answer ) {
            return answer.get('order');
        }*/

    });


    // Discussion Views
    // ----------------

    Discussion.Views.Show = Backbone.View.extend({
        template: 'discussion/show',

        // Delegated events for creating new items.
        events: {
            'keypress #new-answer':       'createOnEnter'
        },

        initialize: function(options) {
            debug.info('Entering Discussion.Views.Show.initialize()...');
            this.question = options.question;
            this.answers = options.answers;
        },

        // Callback function that creates new Answer model.
        createOnEnter: function( e ) {
            debug.info('Entering Discussion.Views.Form.createOnEnter()...');

            // Do nothing if Enter key pressed or input value is blank.
            if (e.which !== Constants.ENTER_KEY || !this.$('#new-answer').val().trim() ) {
                return;
            }

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Create a new instance of a model within this collection.
            this.collection.create(this.newAttributes());

            // Clear input.
            this.$('#new-answer').val('');
        },

        // Generate the attributes for a new Answer model.
        newAttributes: function() {
            debug.info('Entering Discussion.Views.Form.newAttributes()...');

            return {
                title: this.$('#new-answer').val(),
                order: this.collection.nextOrder(),
                completed: false
            };
        },

        serialize: function() {
            debug.info('Entering Discussion.Views.Show.serialize()...');

            console.log("question=[" + this.question + ']');    // TODO
            console.log("answers length=[" + this.collection.length + ']');    // TODO
            console.log(this.collection.toJSON());   // TODO

            return {
                question: this.question,
                answers: this.collection.toJSON(),
                numAnswers: this.collection.length
            };
        }
    });

    Discussion.Views.List = Backbone.View.extend({
        template: 'discussion/list',

        tagName: 'div id="discussion-list-outer"',

        // Delegated events for creating new items.
        events: {
        },

        initialize: function(options) {
            debug.info('Entering Discussion.Views.List.initialize()...');
            this.questions = options.questions;
        },

        serialize: function() {
            debug.info('Entering Discussion.Views.List.serialize()...');

            // TODO: For FB login
            // var hash = window.location.hash;window.close();opener.OAuthRedirect(hash);

            console.log("QUESTIONS length=[" + this.questions.length + ']');    // TODO
            console.log(this.questions.toJSON());   // TODO

            return {
                questions: this.questions.toJSON()
            };
        }
    });

    return Discussion;
});