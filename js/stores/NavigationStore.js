var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var NavigationConstants = require('../constants/NavigationConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var state = NavigationConstants.PERSONAL_PROJECTS;

function update(new_state) {
    if (state !== new_state) {
        state = new_state;
        NavigationStore.emitChange();
    }
}

var NavigationStore = assign({}, EventEmitter.prototype, {

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
        case NavigationConstants.CHANGE_STATE:
            update(action.state);
            break;
        default:
    }
});

module.exports = NavigationStore;
