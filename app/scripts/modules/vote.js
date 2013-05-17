define([
    // Application.
    'app',

    // Libraries
    'backbone',
    'debug'
],
function(app, Backbone, debug) {

    'use strict';

    var Vote = app.module();

    // Vote Model
    // ------------

    Vote.VoteModel = Backbone.Model.extend({

        // Default attributes for a vote.
        defaults: {
            user: null,
            answer: null
        },

        parse: function(response) {
            debug.info('Entering Discussion.VoteModel.parse()...');

            return {
                id: response.id,
                user: response.user.match(/\/api\/user\/(.*)\//)[1],
                answer: response.answer.match(/\/api\/answer\/(.*)\//)[1],
                timestamp: response.timestamp
            };
        },

        initialize: function() {
            debug.info('Entering Vote.VoteModel.initialize()...');
        }

    });

    // Vote Collection
    // -------------------

    Vote.VoteCollection = Backbone.Collection.extend({

        url: 'http://' + app.serverHost + '/api/vote/?format=json',

        // Reference to this collection's model.
        model: Vote.VoteModel,

        parse: function(response) {
            debug.info('Entering Discussion.VoteCollection.parse()...');

            return response.objects;
        },

        initialize: function() {
            debug.info('Entering Discussion.VoteCollection.initialize()...');

            /*this.on('add', function() {
                alert("A vote was added to the vote collection!");
            }, this);*/
        }

    });

    return Vote;
});