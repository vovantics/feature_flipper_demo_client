/*!
 * backbone.featureflipper.js v0.0.1
 * Copyright 2013, stevo (@vovantics)
 * backbone.featureflipper.js may be freely distributed under the MIT license.
 */
(function ( Backbone, _) {
    'use strict';

    // Localize global dependency references.
    var Backbone = window.Backbone;
    var _ = window._;

    var Feature = Backbone.Model.extend({

        // Add user id to Model url.
        url: function() {
            var origUrl = Backbone.Model.prototype.url.call(this);
            return origUrl + '/users/' + this.get('userId') + '/';
        },

        isOn: function () {

            //All is a special case feature. If it is on then always return true for the feature,
            if (this.collection.get('all') && this.collection.get('all').get('active')) {
                var allExcludeList = this.collection.get('all').excludeList;
                if (allExcludeList && _.indexOf(allExcludeList, this.id) > -1) { return this.get('active'); }
                return true;
            }

            return this.get('active');
        },

        whenOn: function (toExecute, context) {
            if (this.isOn() === true) { return toExecute.apply(context || this); }
        },

        whenOff: function (toExecute, context) {
            if (this.isOn() === false) { return toExecute.apply(context || this); }
        },

        turnOn: function () {
            this.set('active', true);
            return this;
        },

        turnOff: function () {
            this.set('active', false);
            return this;
        }

    });

    var FeatureManager = Backbone.Collection.extend({
        model: Feature
    });

    Backbone.FeatureManager = FeatureManager;
    Backbone.Feature = Feature;

}).call(this);