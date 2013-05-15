define([
    // Libraries.
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
],

function($, _, Backbone, Handlebars) {

    'use strict';

    Handlebars.registerHelper('list', function(items, options) {
        var out = '<ul class="unstyled">';

        for(var i=0, l=items.length; i<l; i++) {
            out = out + '<li>' + options.fn(items[i]) + '</li>';
        }

        return out + '</ul>';
    });

});