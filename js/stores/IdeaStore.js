var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var IdeaConstants = require('../constants/IdeaConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var state = [];

function createStory(seed) {
    state.push(generateStory(seed));
    IdeaStore.emitChange();
}

function generateStory(seed) {
    var structure = generateStructure();
    // We have reduced the problem to finding related words of type:
    // - proNoun, properNoun, determiner, adjective, noun, verb, proposition
    for (var i = 0; i < structure.length; ++i) {
        
    }
    return structure;
}

// First, start with past tense verbs (so verbs are all the same!):

// sentence             -> subject predicate
// subject              -> proNoun
//                      -> properNoun
//                      -> determiner descriptiveNoun
// proNoun              -> ...
// properNoun           -> ...
// determiner           -> ...
// descriptiveNoun      -> adjective descriptiveNoun
//                      -> noun
// adjective            -> ...
// noun                 -> ...
// predicate            -> verb
//                      -> verb subject
//                      -> verb subject prepositionPhrase
//                      -> verb prepositionPhrase
// verb                 -> ...
// prepositionPhrase    -> preposition subject
// preposition          -> ...

var grammar = {
    sentence: [ ["subject", "predicate"] ],
    subject: [ ["proNoun"], ["properNoun"], ["determiner", "descriptiveNoun"] ],
    proNoun: [ ["proNoun" ] ],
    properNoun: [ ["properNoun"] ],
    determiner: [ ["determiner"] ],
    descriptiveNoun: [ ["adjective", "descriptiveNoun"], ["noun"] ],
    adjective: [ ["adjective"] ],
    noun: [ ["noun"] ],
    predicate: [ ["verb"], ["verb", "subject"], ["verb", "subject", "prepositionPhrase"] ],
    verb: [ ["verb"] ],
    prepositionPhrase: [ ["preposition", "subject"] ],
    proposition: [ ["preposition"] ]
}

var bases = ["proNoun", "properNoun", "determiner", "noun", "verb", "preposition", "adjective"];

function generateStructure() {
    var currentStructure = ["sentence"];
    while (true) {
        var newStructure = [];
        for (var i = 0; i < currentStructure.length; ++i) {
            var type = currentStructure[i];
            if (bases.indexOf(type) !== -1) {
                newStructure.push(type);
                continue;
            }
            var options = grammar[type];
            // Generate random int between 0 and options.length - 1 inclusive
            var index = Math.floor(Math.random() * options.length);
            var choice = options[index];
            newStructure = newStructure.concat(choice);
        }
        currentStructure = newStructure;
        var basic = true;
        for (var i = 0; i < currentStructure.length; ++i) {
            if (bases.indexOf(currentStructure[i]) === -1) {
                basic = false;
                break;
            }
        }
        if (basic) {
            break;
        }
    } 
    return currentStructure;
}

var IdeaStore = assign({}, EventEmitter.prototype, {

    getState: function() {
        return state;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case IdeaConstants.CREATE_STORY:
            createStory(action.seed);
            break;
        default:
    }
});

module.exports = IdeaStore;
