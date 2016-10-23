var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var IdeaConstants = require('../constants/IdeaConstants');
var assign = require('object-assign');

var Nouns = require('../constants/Nouns');
var ProperNouns = require('../constants/ProperNouns');
var PositiveAdjectives = require('../constants/PositiveAdjectives');
var NegativeAdjectives = require('../constants/NegativeAdjectives');
var DescriptiveAdjectives = require('../constants/DescriptiveAdjectives');
var PastVerbs = require('../constants/PastVerbs');
var IngVerbs = require('../constants/IngVerbs');

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

function getMatchingAndExtend(set, dictionary, length) {
    var matching = [];
    for (var i = 0; i < set.length; ++i) {
        if (dictionary.indexOf(set[i]) !== -1) {
            matching.push(set[i]);
        }
    }
    while (matching.length < length) {
        var another = getRandom(dictionary);
        if (matching.indexOf(another) === -1) {
            matching.push(another);
        }
    }
    return matching;
}

function getRelatedMatchingAndExtend(set, dict1, dict2, length) {
    var matching = [];
    for (var i = 0; i < set.length; ++i) {
        var index = dict1.indexOf(set[i]);
        if (index !== -1) {
            matching.push(dict2[index]);
        }
    }
    while (matching.length < length) {
        var another = getRandom(dict2);
        if (matching.indexOf(another) === -1) {
            matching.push(another);
        }
    }
    return matching;
}

function generateStory(instance) {
    var association = state[instance]["association"];

    var nouns = getMatchingAndExtend(association, Nouns, 25);
    var properNouns = getMatchingAndExtend([], ProperNouns, 15);
    var adjectives = getMatchingAndExtend(association, PositiveAdjectives.concat(NegativeAdjectives.concat(DescriptiveAdjectives)), 20);
    var verbs = getRelatedMatchingAndExtend(association, IngVerbs, PastVerbs, 20);
console.log(association);
console.log(nouns);
console.log(properNouns);
console.log(adjectives);
console.log(verbs)
    // Controlled iterators.
    var nI = 0;
    var pnI = 0;
    var aI = 0;
    var vI = 0;

    // The number of sentences to produce in a story.
    var volume = 3;
    var sentences = [];
    for (var v = 0; v < volume; ++v) {
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
                    sentence.push(properNouns[pnI]);
                    pnI = (pnI + 1) % properNouns.length;
                    break;
                case "adjective":
                    sentence.push(adjectives[aI]);
                    aI = (aI + 1) % adjectives.length;
                    break;
                case "noun":
                    sentence.push(nouns[nI]);
                    nI = (nI + 1) % nouns.length;
                    break;
                case "verb":
                    sentence.push(verbs[vI]);
                    vI = (vI + 1) % verbs.length;
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
        sentences.push(result);
    }
    state[instance]["stories"].push(sentences.join("  "));
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

var initialRuleUses = {
    sentence: 0,
    subject: 0,
    proNoun: 0,
    properNoun: 0,
    determiner: 0,
    descriptiveNoun: 0,
    adjective: 0,
    noun: 0,
    predicate: 0,
    verb: 0,
    prepositionPhrase: 0,
    proposition: 0
}

var bases = ["proNoun", "properNoun", "determiner", "noun", "verb", "preposition", "adjective"];
var proNouns = ["I", "he", "she", "one", "they", "it", "you"];
var determiners = ["the", "a", "this", "that", "my", "your", "his", "her", "our", "any"];
var prepositions = ["from", "to", "on", "near", "above", "across", "among", "behind", "below", "beyond"];

function getWeightedRandom(options, weights) {
    return options[weights[Math.floor(Math.random() * weights.length)]];
}

function generateStructure() {
    // Current structure of the sentence.
    var currentStructure = ["sentence"];
    // Current uses of each rule in the grammar.
    var ruleUses = initialRuleUses;
    while (true) {
        var newStructure = [];
        for (var i = 0; i < currentStructure.length; ++i) {
            var type = currentStructure[i];
            if (bases.indexOf(type) !== -1) {
                newStructure.push(type);
                continue;
            }
            var options = grammar[type];
            var uses = ruleUses[type];
            // Choose one of the options
            var choice;
            switch(type) {
                case "subject":
                    choice = uses === 0 ? getRandom(options) : getWeightedRandom(options, [1, 2, 2]);
                    break;
                default:
                    choice = getRandom(options);
            }
            ruleUses[type] = ruleUses[type] + 1;
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