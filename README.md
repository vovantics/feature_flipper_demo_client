# feature flipper demo - client

## TODO

* Create user module

* Implement JS flipper for free user registration and then facebook connect 
* Create discussion module
* Implement question and answer flows for Profs and Students
* Create notification module
* Implement answer upvote
* Implement notification module
* Implement notification upon upvote
* Document features: https://www.djangopackages.com/grids/g/feature-flip/, http://www.iheavy.com/2011/08/26/5-things-are-toxic-to-scalability/


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
* Dogfooding: Decouple pushes from feature activation. Put a "feature flip" switch on your code early. Deploy it to production as often as possible. Enable this feature only for early adopters (i.e. employees, ardent supporters). When it's ready, flip the switch for your new feature to come online!
* Contingency levers: During unexpected load traffic times, throttling back the behavior of certain features will allow us to lighten the demand on our infrastructure.

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