var AppDispatcher = require('../dispatcher/AppDispatcher');
var IdeaConstants = require('../constants/IdeaConstants');

var IdeaActions = {
    generateStory: function(instance) {
        AppDispatcher.dispatch({
            actionType: IdeaConstants.GENERATE_STORY,
            instance: instance
        });
    },
    sendImageData: function(imageData) {
        AppDispatcher.dispatch({
            actionType: IdeaConstants.SEND_IMAGE,
            imageData: imageData
        });
    }
};

module.exports = IdeaActions;
