# feature flipper demo - client

## Examples

### Example 1

We want to A/B test the success rate of sign up conversions with and w/o requiring payment.

First, decorate the feature with a flag: "User receives notifications upon upvote of an answer."

### Example 2

Suppose that discussion answer votes are stored in a memcached datastore. Also, our memcached instance is full and is now booting out data. We want to disable the voting feature, fix the problem, then enable it again.

First, decorate the feature with flag: "User can upvote an answer."

### Example 3

Suppose someone came up with the idea of pushing notifications to users when their answers are upvoted. Notifications are an epic task. 

Decorate all feature code with flag: "User receives notifications upon upvote of an answer.", iteratively code and ship it everyday, then enable the flag once the feature is complete.

## TODO

* Document features: https://www.djangopackages.com/grids/g/feature-flip/, http://www.iheavy.com/2011/08/26/5-things-are-toxic-to-scalability/
* Document workflow: https://github.com/bigodines/feature-flipper-js
* Document hard & fast rules on model layer changes.
* Document the use of flags and switches in backbone.featureflipper.js: http://waffle.readthedocs.org/en/latest/types.html#flags

## Problem:

We don't have the ability to enable/disable a feature for a set of users.

## Proposed solution:

Write a backbone.js feature flipper.

## Goals

* Quickly add in feature-flipping code for new features.
* Have useful defaults (i.e. features to be ‘on’ for admin (ie internal) users, and off for external users).

## Challenges:

* JS feature flipper should use the same set of feature flags as server side feature flippers.
* Feature success criteria should be tracked, sliced, and diced using a 3rd party analytics tool (i.e. mixpanel). How do you implement this without thinking about it?
* Database schemas need to be altered. How do you design a DB for a multi version app?
* The environment is never homogeneous with respect to which verions of the service layer and UI are running on the servers. That means features need to be designed with backward and forward compatibility in mind. Can this be done?

## Use Cases:

* Keep calm and flip the feature off: disabling/reverting features when you encounter problems (i.e. FB connect)
* Contingency levers: During unexpected load traffic times, throttling back the behavior of certain features will allow us to lighten the demand on our infrastructure.

* Dogfooding: Decouple pushes from feature activation. Put a "feature flip" switch on your code early. Deploy it to production as often as possible. Enable this feature only for early adopters (i.e. employees, ardent supporters). When it's ready, flip the switch for your new feature to come online!
* A/B testing

## Resources

* Feature Flipping: http://webdevnights.github.io/feature-flipping/#/first
* Flipping Out: http://code.flickr.net/2009/12/02/flipping-out/
* Gatekeeper: http://java.dzone.com/articles/pushing-twice-daily-our, http://www.quora.com/Facebook-Engineering/How-does-Facebooks-Gatekeeper-service-work
* Feature Flipping: http://99designs.com/tech-blog/blog/2012/03/01/feature-flipping/
* feature-flipper.js: http://blog.beyondfog.com/feature-flipping-with-node-js-and-mongodb/#.UY0AOSuDS2w

## User Stories

* A: Student can register a "user" [account] for free.
* B: Student can register a "user" [account] via facebook connect.
* C: Prof can post a "question" and Student can post an "answer".
* D: Student can "upvote" an "answer".
* E: Student receives "notification" when another Student "upvotes" his/her "answer".

## Workflow

* Develop a feature;
* Add it to feature flipper;
* Enabled it to yourself (it should be ok to use production env as all features are disabled by default);
* Test, test, test;
* Enable to all users;
* After feature is stable, remove the old version of the feature if it exists.
* Clean up your code and get back to 1)