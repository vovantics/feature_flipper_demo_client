/*global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',

    'backbone.layoutmanager',
    'backbone.featureflipper'
],
function ($, _, Backbone, Handlebars) {
    'use strict';

    // Provide a global location to place configuration settings and module
    // creation.
    var app = {
        // The root path to run the application through.
        root: '/',
        name: 'Feature Flipper Demo',
        serverHost: '127.0.0.1:8000'
    };

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    // Configure LayoutManager.
    Backbone.Layout.configure({
        // Allow LayoutManager to augment Backbone.View.prototype.
        manage: true,

        prefix: 'templates/',

        fetch: function(path) {

            var done;

            // Add the html extension.
            path = path + '.html';

            // If the template has not been loaded yet, then load.
            if (!JST[path]) {
                done = this.async();
                return $.ajax({ url: app.root + path }).then(function(contents) {
                    JST[path] = Handlebars.compile(contents);
                    JST[path].__compiled__ = true;

                    done(JST[path]);
                });
            }

            // If the template hasn't been compiled yet, then compile.
            if (!JST[path].__compiled__) {
                JST[path] = Handlebars.template(JST[path]);
                JST[path].__compiled__ = true;
            }

            return JST[path];
        }
    });

    // Configure FeatureManager.
    Backbone.Feature = Backbone.Feature.extend({
        urlRoot: 'http://127.0.0.1:8000/api/feature/'
    });

    // Mix Backbone.Events, modules, and layout management into the app object.
    return _.extend(app, {
        // Create a custom object with a nested Views object.
        module: function(additionalProps) {
            return _.extend({ Views: {} }, additionalProps);
        },

        // Helper for using layouts.
        useLayout: function(name, options) {
            // If already using this Layout, then don't re-inject into the DOM.
            if (this.layout && this.layout.options.template === name) {
                return this.layout;
            }

            // If a layout already exists, remove it from the DOM.
            if (this.layout) {
                this.layout.remove();
            }

            // Create a new Layout with options.
            var layout = new Backbone.Layout(_.extend({
                template: 'layouts/' + name,
                className: 'l-' + name,
                id: 'layout'
            }, options));

            // Insert into the DOM.
            $('#main').empty().append(layout.el);

            // Render the layout.
            //layout.render();

            // Cache the refererence.
            this.layout = layout;

            // Return the reference, for chainability.
            return layout;
        },

        feature: function(featureId, userId) {
            //console.log('Entering feature() feature_id=[' + featureId + '] user_id=[' + userId + ']...');

            if (!this.features) {
                this.features = new Backbone.FeatureManager();
            }

            var model = this.features.get(featureId);
            if (model) {
                //console.info('Feature id=[' + featureId + '] exists! active=[' + model.get('active') + '].');
                return model;
            }
            else {
                //console.info('Feature id=[' + featureId + '] DNE! Creating feature with feature_id=[' + featureId + '] active=[false] user_id=[' + userId + ']');
                model = new Backbone.Feature({
                    id: featureId,
                    active: false,
                    userId: userId
                });
                this.features.add(model);
                return model;
            }
        }

    }, Backbone.Events);
});