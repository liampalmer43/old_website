var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var IdeaConstants = require('../constants/IdeaConstants');
var assign = require('object-assign');

var Nouns = require('../constants/Nouns');

var CHANGE_EVENT = 'change';

var state = [];

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function isVowel(letter) {
    return letter === "a" || letter === "e" || letter === "i" || letter === "o" || letter === "u";
}

var BASE64_MARKER = ";base64,";

function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

function sendImage(imageData) {
    var name = imageData[0];
    var dataURL = imageData[1];
    var image = convertDataURIToBinary(dataURL);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description&subscription-key=9f29dc017074487e9150b2265d8e39aa", true);
    xhr.setRequestHeader("Content-type", "application/octet-stream");
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var association = response["description"]["tags"];
            alert(association.join());
            var group = {
                name: name,
                dataURL: dataURL,
                association: association,
                stories: []
            };
            state.unshift(group);
            IdeaStore.emitChange();
        }
    }
    xhr.send(image);
}

function generateStory(instance) {
    var association = state[instance]["association"];
    var structure = generateStructure();
    // We have reduced the problem to finding related words of type:
    // - proNoun, properNoun, determiner, adjective, noun, verb, preposition
    var sentence = [];
    for (var i = 0; i < structure.length; ++i) {
        switch(structure[i]) {
            case "proNoun":
                sentence.push(getRandom(proNouns));
                break;
            case "determiner":
                sentence.push(getRandom(determiners));
                break;
            case "preposition":
                sentence.push(getRandom(prepositions));
                break;
            case "properNoun":
                sentence.push(getRelatedProperNoun(association));
                break;
            case "adjective":
                sentence.push(getRelatedAdjective(association));
                break;
            case "noun":
                sentence.push(getRelatedNoun(association));
                break;
            case "verb":
                sentence.push(getRelatedVerb(association));
                break;
            default:
        }
    }
    // Convert "a" to "an" as necessary.
    for (var i = 0; i < sentence.length; ++i) {
        if (sentence[i] === "a" && isVowel(sentence[i+1])) {
            sentence[i] = "an";
        }
    }
    var result = sentence.join(" ");
    result += ".";
    result = result.charAt(0).toUpperCase() + result.slice(1);
    //return result;
    state[instance]["stories"].push(result);
    IdeaStore.emitChange();
}

function getRelatedProperNoun(association) {
    return getRandom([]);
}

function getRelatedNoun(association) {
    return "dog";
}

function getRelatedAdjective(association) {
    return "yellow";
}

function getRelatedVerb(association) {
    return "hated";
}

// First, start with past tense verbs (so verbs are all the same!):
// Also, keep the nouns singular:

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
var proNouns = ["I", "he", "she", "one", "they", "it", "you"];
var determiners = ["the", "a", "this", "that", "my", "your", "his", "her", "our", "any"];
var prepositions = ["from", "to", "on", "near", "above", "across", "among", "behind", "below", "beyond"];

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
            // Choose one of the options randomly
            var choice = getRandom(options);
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
        case IdeaConstants.GENERATE_STORY:
            console.log("STORE");
            generateStory(action.instance);
            console.log("DONE");
            break;
        case IdeaConstants.SEND_IMAGE:
            sendImage(action.imageData);
            break;
        default:
    }
});

module.exports = IdeaStore;
