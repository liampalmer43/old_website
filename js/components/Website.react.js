var Header = require('./Header.react');
var PersonalProjects = require('./PersonalProjects.react');
var Internships = require('./Internships.react');
var Coding = require('./Coding.react');
var PictoStory = require('./Idea.react');
var React = require('react');
var NavigationStore = require('../stores/NavigationStore');
var NavigationConstants = require('../constants/NavigationConstants');
var NavigationActions = require('../actions/NavigationActions');

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

        const page = this.props.match.params.page;
        if (page) {
            switch (page) {
                case 'internships':
                    NavigationActions.update(NavigationConstants.INTERNSHIPS);
                    break;
                case 'coding':
                    NavigationActions.update(NavigationConstants.CODING);
                    break;
                case 'resume':
                    NavigationActions.update(NavigationConstants.RESUME);
                    break;
                default:
                    // Nothing, state is already set to inital value.
                    break;
            }
        }
        console.log(page);
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
            case NavigationConstants.RESUME:
                content = <div className="center">
                            <iframe src="photos/Liam_Resume_4A.pdf" width="750" height="1030">
                                <a href="photos/Liam_Resume_4A.pdf">Download PDF</a>
                            </iframe>
                            <div className="space" />
                            <iframe src="photos/Grade_Report.pdf" width="750" height="2170">
                                <a href="photos/Grade_Report.pdf">Download PDF</a>
                            </iframe>
                          </div>
                break;
            case NavigationConstants.PICTO_STORY:
                content = <PictoStory />;
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
