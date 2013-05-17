define([
    // Application.
    'app',

    // Libraries
    'jquery',
    'underscore',
    'backbone',
    'debug',

    // Modules
    'modules/meta',
    'modules/user',
    'modules/vote',
    'modules/constants',
    'modules/helpers',

    'backbone.subroute'
],
function(app, $, _, Backbone, debug, Meta, User, Vote, Constants) {
    'use strict';
    var Discussion = app.module();

    // Discussion Router
    // -----------------

    Discussion.Router = Backbone.SubRoute.extend({

        routes: {
            '': 'list',             // #discussions/
            ':id': 'show',          // #discussions/1/
        },

        initialize: function(options) {
            debug.info('Entering Discussion.Router.initialize()...');

            this.session = options.session;
            this.user = options.user;
            this.notifications = options.notifications;

            // Fetch any preexisting questions from the server.
            this.questions = new Discussion.QuestionCollection([]);
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
        },

        show: function(id) {
            debug.info('Entering Discussion.Router.show()...');

            // Fetch answers for question.
            var question = this.questions.get(id);
            var answers = new Discussion.AnswerCollection([]);
            answers.fetch({ async: false, data: $.param({question: question.id}) });

            // Set layout and views, then render.
            app.useLayout('discussion').setViews({
                '#container-nav': new Meta.Views.Nav({
                    model: this.session,
                    notifications: this.notifications
                }),
                '#container-question': new Discussion.Views.ShowQuestion({
                    session: this.session,
                    question: question,
                    collection: answers
                }),
                '#container-stats': new Discussion.Views.Stats({
                    collection: answers
                }),
                '#container-answers': new Discussion.Views.ListAnswers({
                    session: this.session,
                    notifications: this.notifications,
                    //model: this.user,
                    collection: answers
                })
            }).render();

            // Poll the server for updates to this question's answers.
            setInterval(function () {
                debug.info("Fetching answers from the server...");
                answers.fetch({ async: false, reset: true, data: $.param({question: question.id}) });
            }, 10000);
        },

        list: function() {
            debug.info('Entering Discussion.Router.list()...');

            console.log("Passing [" + this.questions.length + '] questions to discussion view...');
            console.log(this.questions.toJSON());

            // Set layout and views, then render.
            app.useLayout('onecolumn').setViews({
                '#container-nav': new Meta.Views.Nav({
                    model: this.session,
                    notifications: this.notifications
                }),
                '#container-content': new Discussion.Views.ListQuestions({
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
            userId: null
        },

        parse: function(response) {
            debug.info('Entering Discussion.QuestionModel.parse()...');

            console.log('question id=[' + response.id + '] text=[' + response.text + '] username=[' + response.user.username + ']');

            return {
                id: response.id,
                text: response.text,
                username: response.user.username
                //userId: response.user.match(/\/api\/user\/(.*)\//)[1]
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
            return response.objects;
        },

        initialize: function() {
            debug.info('Entering Discussion.QuestionCollection.initialize()...');
        }

    });

    // Answer Model
    // ------------

    Discussion.AnswerModel = Backbone.Model.extend({

        // Default attributes for an answer.
        defaults: {
            text: '',
            username: null
        },

        parse: function(response) {
            debug.info('Entering Discussion.AnswerModel.parse()...');

            debug.info('Answer text=[' + response.answer + '] timestamp=[' + response.timestamp + ']'); // TODO

            return {
                id: response.id,
                text: response.text,
                timestamp: response.timestamp,
                username: response.user.username,
                userId: response.user.id
            };
        }

    });


    // Answer Collection
    // -----------------

    Discussion.AnswerCollection = Backbone.Collection.extend({

        url: 'http://' + app.serverHost + '/api/answer/',

        // Reference to this collection's model.
        model: Discussion.AnswerModel,

        parse: function(response) {
            debug.info('Entering Discussion.AnswerCollection.parse()...');

            return response.objects;
        },

        initialize: function() {
        },

        // We keep the Answers in sequential order, despite being saved by unordered
        // GUID in the database. This generates the next order number for new items.
        nextOrder: function() {
            if ( !this.length ) {
                return 1;
            }
            return this.last().get('order') + 1;
        }

    });


    // Discussion Views
    // ----------------

    Discussion.Views.ShowQuestion = Backbone.View.extend({
        template: 'discussion/show',

        // Delegated events for creating new items.
        events: {
            'keypress #new-answer':       'createOnEnter'
        },

        initialize: function(options) {
            debug.info('Entering Discussion.Views.Show.initialize()...');

            this.session = options.session;
            this.question = options.question;
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
                text: this.$('#new-answer').val(),
                question: {'pk': this.question.id},
                user: {'pk': this.session.id}
            };
        },

        serialize: function() {
            debug.info('Entering Discussion.Views.Show.serialize()...');

            return {
                question: this.question.get('text')
                /*answers: this.collection.toJSON(),
                numAnswers: this.collection.length*/    // TODO: Put this somewhere
            };
        }
    });

    Discussion.Views.Stats = Backbone.View.extend({
        template: 'discussion/answer_stats',

        // Provides the template with the model data to render.
        serialize: function() {
            debug.info('Entering Discussion.Views.Stats.serialize()...');

            return {
                numAnswers: this.collection.length
            };
        },
    });

    // The view that comprises the DOM elements for an answer list.
    Discussion.Views.ListAnswers = Backbone.View.extend({

        tagName: 'ul id="answer-list" class="unstyled answer-list"',

        // This view listens for changes to its collection,
        // re-rendering.
        initialize: function(options) {
            debug.info('Entering Views.ListAnswers.initialize()...');

            this.session = options.session;

            // Collection.fetch() will call reset() on success, which
            // in turn will trigger a "reset" event
            this.collection.on('reset', function() {
                this.render();
            }, this);

            // When model is added to this collection, insert item
            // view.
            this.collection.on('add', function(item) {
                this.insertView(new Discussion.Views.ShowAnswer({
                    model: item,
                    notifications: this.notifications,
                    session: this.session
                })).render();
            }, this);
        },

        beforeRender: function() {
            console.log('Entering Views.ListAnswers.beforeRender()...');

            // Insert each item view before render.
            this.collection.each(function(item) {
                this.insertView(new Discussion.Views.ShowAnswer({
                    model: item,
                    notifications: this.notifications,
                    session: this.session
                }));
            }, this);
        }

    });

    // The view that comprises the DOM element for an answer.
    Discussion.Views.ShowAnswer = Backbone.View.extend({
        template: 'discussion/answer_show',

        tagName: 'li',

        // Delegated events for creating new items.
        events: {
            'click .upvote': 'createVoteOnClick'
        },

        initialize: function(options) {
            debug.info('Entering Discussion.Views.ShowAnswer.initialize()...');

            this.session = options.session;
            this.notifications = options.notifications;

            this.votes = new Vote.VoteCollection([]);
            this.votes.fetch({ async: false, data: $.param({answer: this.model.id}) });
        },

        createVoteOnClick: function(e) {
            debug.info('Entering Discussion.Views.ShowAnswer.createVoteOnClick()...');

            // Cancel default action of the keypress event.
            e.preventDefault();

            // Create vote
            this.votes.create(this.newAttributes());

            app.feature(3, this.session.id).whenOn( function() {
                this.notifications.create({
                    message: 'Someone agreed with your answer!',
                    user_from: this.session.id,
                    user_to: this.model.get('userId'),
                });
            });

            // TODO: Create notification
            //console.log('Upvoting answer text=[' + this.model.get('text') + '] by username=[' + this.model.get('username') + '] voterId=[' + this.session.id+ '] answerId=[' + this.model.id + ']');
        },

        // Generate the attributes for a new Answer model.
        newAttributes: function() {
            debug.info('Entering Discussion.Views.ShowAnswer.newAttributes()...');

            return {
                user: {'pk': this.session.id},
                answer: {'pk': this.model.id}
            };
        },

        // Provides the template with the model data to render.
        serialize: function() {
            debug.info('Entering Discussion.Views.Item.serialize()...');

            return {
                upvoteAnswer: app.feature(2, this.session.id),
                username: this.model.get('username'),
                timestamp: this.model.get('timestamp'),
                text: this.model.get('text'),
                numVotes: this.votes.length
            };
        },
    });

    Discussion.Views.ListQuestions = Backbone.View.extend({
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

            return {
                questions: this.questions.toJSON()
            };
        }
    });

    return Discussion;
});