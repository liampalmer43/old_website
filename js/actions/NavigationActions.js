var AppDispatcher = require('../dispatcher/AppDispatcher');
var NavigationConstants = require('../constants/NavigationConstants');

var NavigationActions = {
    update: function(state) {
        AppDispatcher.dispatch({
            actionType: NavigationConstants.CHANGE_STATE,
            state: state
        });
    }
};

module.exports = NavigationActions;
