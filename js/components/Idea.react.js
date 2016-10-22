// var Coding = require('./Coding.react');
var React = require('react');
var IdeaStore = require('../stores/IdeaStore');
var IdeaConstants = require('../constants/IdeaConstants');
var IdeaActions = require('../actions/IdeaActions');

function getState() {
    return {
        stories: IdeaStore.getState()
    };
}

var Idea = React.createClass({
    
    _createStory: function() {
        IdeaActions.createStory("Apple");
    },

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        IdeaStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        IdeaStore.removeChangeListener(this._onChange);
    },

    render: function() {
/*
        content = <PersonalProjects />;
        switch(this.state.websiteState) {
            case NavigationConstants.PERSONAL_PROJECTS:
                content = <PersonalProjects />;
                break;
            case NavigationConstants.INTERNSHIPS:
                content = <Internships />;
                break;
            case NavigationConstants.CODING:
                content = <Coding />;
                break;
            case NavigationConstants.RESUME:
                content = <div className="center"><embed src="photos/resume.pdf" width="750" height="950" type='application/pdf' /></div>
                break;
            default:
        }
  */      
    var stories = this.state.stories;
    var displays = [];
    for (var i = 0; i < stories.length; ++i) {
        displays.push(<h4 key={i}>{stories[i]}</h4>);
    }
        return (
            <div>
                <div className="idea" onClick={this._createStory}>hello world</div>
                <div>{displays}</div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getState());
    }
});

module.exports = Idea;
