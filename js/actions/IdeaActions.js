var AppDispatcher = require('../dispatcher/AppDispatcher');
var IdeaConstants = require('../constants/IdeaConstants');

var IdeaActions = {
    createStory: function(seed) {
        AppDispatcher.dispatch({
            actionType: IdeaConstants.CREATE_STORY,
            seed: seed
        });
    }
};

module.exports = IdeaActions;
