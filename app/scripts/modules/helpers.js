define([
    // Libraries.
    'jquery',
    'underscore',
    'backbone',
    'handlebars',

    'moment'
],

function($, _, Backbone, Handlebars, moment) {

    'use strict';

    Handlebars.registerHelper('list', function(items, options) {
        var out = '<ul class="unstyled answer-list">';

        for(var i=0, l=items.length; i<l; i++) {
            out = out + '<li>' + options.fn(items[i]) + '</li>';
        }

        return out + '</ul>';
    });

    //  format an ISO date using Moment.js
    //  http://momentjs.com/
    //  moment syntax example: moment(Date("2011-07-18T15:50:52")).format("MMMM YYYY")
    //  usage: {{dateFormat creation_date format="MMMM YYYY"}}
    Handlebars.registerHelper('dateFormat', function(context, block) {
        var f = block.hash.format || 'MMM Do, YYYY hh:mm:ss';
        return moment(Date(context)).format(f);
    });

});