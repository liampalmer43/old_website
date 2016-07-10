var React = require('react');
var NavigationActions = require('../actions/NavigationActions');
var NavigationConstants = require('../constants/NavigationConstants');
var Button = require('react-bootstrap/lib/Button');

var Header = React.createClass({
    _personalProjects: function() {
        NavigationActions.update(NavigationConstants.PERSONAL_PROJECTS);
    },

    _internships: function() {
        NavigationActions.update(NavigationConstants.INTERNSHIPS);
    },

    render: function() {
        return (
            <div className="header">
                <h1>Liam Palmer</h1>
                <h5>University of Waterloo - Computer Science, Applied Math, Computational Math</h5>
                <Button onClick={this._personalProjects}>PERSONAL_PROJECTS</Button>
                <Button onClick={this._internships}>INTERNSHIPS</Button>
            </div>
        );
    }
});

module.exports = Header;
