var Header = require('./Header.react');
var PersonalProjects = require('./PersonalProjects.react');
var Internships = require('./Internships.react');
var Coding = require('./Coding.react');
var React = require('react');
var NavigationStore = require('../stores/NavigationStore');
var NavigationConstants = require('../constants/NavigationConstants');

function getState() {
    return {
        websiteState: NavigationStore.getState()
    };
}

var Website = React.createClass({

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        NavigationStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        NavigationStore.removeChangeListener(this._onChange);
    },

    render: function() {
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
            default:
        }
        
        return (
            <div>
                <Header />
                <div className="spacer" />
                {content}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getState());
    }
});

module.exports = Website;
