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
var Templates = require('../constants/Templates');

var CHANGE_EVENT = 'change';

var state = [];
var gangster = false;
var template = false;

function setGangster(g) {
    gangster = g;
    IdeaStore.emitChange();
}

function setTemplate(t) {
    template = t;
    IdeaStore.emitChange();
}

function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function scramble(array) {
    for (var i = 0; i < 15; ++i) {
        var index1 = Math.floor(Math.random() * array.length);
        var index2 = Math.floor(Math.random() * array.length);
        var temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
    }
    return array;
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
    var group = {
        name: name,
        dataURL: dataURL,
        association: [],
        emotions: {},
        stories: [],
        visionAPI: false,
        emotionAPI: false
    };
    var len = state.unshift(group);
    IdeaStore.emitChange();
    computerVisionAPI(image, len);
    emotionAPI(image, len);
}

function computerVisionAPI(image, offsetFromEnd) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description&subscription-key=9f29dc017074487e9150b2265d8e39aa", true);
    xhr.setRequestHeader("Content-type", "application/octet-stream");
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var association = response["description"]["tags"];
            // alert(association.join());
            state[state.length - offsetFromEnd]["association"] = association;
        }
        state[state.length - offsetFromEnd]["visionAPI"] = true;
        IdeaStore.emitChange();
    }
    xhr.send(image);
}

function emotionAPI(image, offsetFromEnd) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.projectoxford.ai/emotion/v1.0/recognize", true);
    xhr.setRequestHeader("Content-type", "application/octet-stream");
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", "ac048eb2f682492a8194b2e56af29e20");
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            // alert("Got emotion");
            if (response.length > 0) {
                var scores = response[0]["scores"];
                state[state.length - offsetFromEnd]["emotions"] = scores;
            }
            state[state.length - offsetFromEnd]["emotionAPI"] = true;
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

function extractEmotion(emotions) {
    // 0 for positive, 1 for negative, 2 for neutral
    var feelings = Object.keys(emotions);
    if (feelings.length === 0) {
        return 2;
    }
    var positiveEmotions = ["happiness", "surprise"];
    var negativeEmotions = ["anger", "contempt", "disgust", "fear", "sadness"];
    var neutralEmotions = ["neutral"];
    var posS = 0.0;
    var negS = 0.0;
    var neuS = 0.0;
    for (var i = 0; i < feelings.length; ++i) {
        if (positiveEmotions.indexOf(feelings[i]) !== -1) {
            posS += emotions[feelings[i]];
        } else if (negativeEmotions.indexOf(feelings[i]) !== -1) {
            negS += emotions[feelings[i]];
        } else if (neutralEmotions.indexOf(feelings[i]) !== -1) {
            neuS += emotions[feelings[i]];
        } else {
            alert("Unregistered emotion" + feelings[i]);
        }
    }
    if (neuS >= posS && neuS >= negS) {
        return 2;
    } else if (posS >= negS) {
        return 0;
    } else {
        return 1;
    }
}

function generateStory(instance) {
    var association = state[instance]["association"];
    var emotions = state[instance]["emotions"];

    var nouns = getMatchingAndExtend(association, Nouns, 25);
    var properNouns = getMatchingAndExtend([], ProperNouns, 15);
    var adjectives;
    var emotion = extractEmotion(emotions);
    if (emotion === 0) {
        adjectives = getMatchingAndExtend(association, PositiveAdjectives.concat(DescriptiveAdjectives), 20);
    } else if (emotion === 1) {
        adjectives = getMatchingAndExtend(association, NegativeAdjectives.concat(DescriptiveAdjectives), 20);
    } else {
        adjectives = getMatchingAndExtend(association, PositiveAdjectives.concat(NegativeAdjectives.concat(DescriptiveAdjectives)), 20);
    }
    var verbs = getRelatedMatchingAndExtend(association, IngVerbs, PastVerbs, 20);

    // Some mixing.
    nouns = scramble(nouns);
    adjectives = scramble(adjectives);
    verbs = scramble(verbs);

    // Controlled iterators.
    var nI = 0;
    var pnI = 0;
    var aI = 0;
    var vI = 0;

    // The number of sentences to produce in a story.
    var volume = 3;
    var sentences = [];
    for (var v = 0; v < volume; ++v) {
        var structure;
        if (template) {
            var pick = getRandom(Templates);
            structure = pick.split(" "); 
        } else {
            structure = generateStructure();
        }
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
                    // In the case it is an actual word.
                    sentence.push(structure[i]);
                    break;
            }
        }
        // Convert "a" to "an" as necessary.
        for (var i = 0; i < sentence.length; ++i) {
            if (sentence[i] === "a" && isVowel(sentence[i+1].charAt(0))) {
                sentence[i] = "an";
            }
        }
        var result = sentence.join(" ");
        // Handle the gangster functionality.
        if (gangster) {
            if (v === 0) {
                result = getRandom(greetings) + result;
            }
            if (v === volume - 1) {
                result += getRandom(terminals);
            }
        }
        result += ".";
        result = result.charAt(0).toUpperCase() + result.slice(1);
        sentences.push(result);
    }
    state[instance]["stories"].unshift(sentences.join("  "));
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

// *** We also add FPsubject for a subject that "follows a predicate". ***
// *** We also add nextNoun to control adjectives. ***
var grammar = {
    sentence: [ ["subject", "predicate"] ],
    subject: [ ["proNoun"], ["properNoun"], ["determiner", "descriptiveNoun"] ],
    FPsubject: [ ["properNoun"], ["determiner", "descriptiveNoun"] ],
    proNoun: [ ["proNoun" ] ],
    properNoun: [ ["properNoun"] ],
    determiner: [ ["determiner"] ],
    descriptiveNoun: [ ["adjective", "nextNoun"] ],
    nextNoun: [ ["adjective", "noun"], ["noun"] ],
    adjective: [ ["adjective"] ],
    noun: [ ["noun"] ],
    predicate: [ ["verb"], ["verb", "subject"], ["verb", "subject", "prepositionPhrase"] ],
    verb: [ ["verb"] ],
    prepositionPhrase: [ ["preposition", "FPsubject"] ],
    proposition: [ ["preposition"] ]
}

var initialRuleUses = {
    sentence: 0,
    subject: 0,
    FPsubject: 0,
    proNoun: 0,
    properNoun: 0,
    determiner: 0,
    descriptiveNoun: 0,
    nextNoun: 0,
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
// For the gangster feature:
var greetings = ["yo dawg, ", "sup bro, ", "what's up homie, ", "wassup, ", "damn son, ", "you know how it is, ", "straight up I'll tell you, "];
var terminals = [", you know what I'm saying", ", straight up", ", ya feel me", ".  You gotta be out of you mind"];

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
                    choice = uses === 0 ? getRandom(options) : getWeightedRandom(options, [1, 1, 2, 2, 2, 2, 2]);
                    break;
                case "nextNoun":
                    choice = getWeightedRandom(options, [0, 0, 1, 1, 1]);
                    break;
                case "predicate":
                    choice = options[2];
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

    getGangster: function() {
        return gangster;
    },

    getTemplate: function() {
        return template;
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
            generateStory(action.instance);
            break;
        case IdeaConstants.SEND_IMAGE:
            sendImage(action.imageData);
            break;
        case IdeaConstants.SET_GANGSTER:
            setGangster(action.gangster);
            break;
        case IdeaConstants.SET_TEMPLATE:
            setTemplate(action.template);
            break;
        default:
    }
});

module.exports = IdeaStore;
