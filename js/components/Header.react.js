var React = require('react');

var NavigationActions = require('../actions/NavigationActions');
var NavigationConstants = require('../constants/NavigationConstants');

var Button = require('react-bootstrap/lib/Button');
var Col = require('react-bootstrap/lib/Col');
var Row = require('react-bootstrap/lib/Row');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');

var MenuItem = require('./MenuItem.react');

var Header = React.createClass({
    _personalProjects: function() {
        NavigationActions.update(NavigationConstants.PERSONAL_PROJECTS);
    },

    _internships: function() {
        NavigationActions.update(NavigationConstants.INTERNSHIPS);
    },

    _coding: function() {
        NavigationActions.update(NavigationConstants.CODING);
    },

    _resume: function() {
        NavigationActions.update(NavigationConstants.RESUME);
    },

    render: function() {
        return (
            <div className="header">
                <Row>
                    <Col xs={4} sm={4} md={4} lg={4} className="header_left">
                        <MenuItem state={NavigationConstants.PERSONAL_PROJECTS} image_path={'photos/Adventure.jpg'} title={'ADVENTURES'} onclick={this._personalProjects}/>
                        <MenuItem state={NavigationConstants.INTERNSHIPS} image_path={'photos/Intern.jpg'} title={'INTERNSHIPS'} onclick={this._internships}/>
                        <MenuItem state={NavigationConstants.CODING} image_path={'photos/Coding.jpg'} title={'CODING'} onclick={this._coding}/>
                        <MenuItem state={NavigationConstants.RESUME} image_path={'photos/resume.jpg'} title={'RESUME'} onclick={this._resume}/>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} className="header_center">
                        <p className="name">Liam Palmer</p>
                        <h5><Glyphicon glyph="envelope" /> liampalmer43@gmail.com</h5>
                        <h5><Glyphicon glyph="globe" /> LinkedIn: liampalmer43</h5>
                        <h5><Glyphicon glyph="phone" /> GitHub: liampalmer43</h5>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} className="header_right">
                        <h5>University of Waterloo <Glyphicon glyph="education" /></h5>
                        <h5>Computer Science <Glyphicon glyph="hand-left" /></h5>
                        <h5>Applied Mathematics <Glyphicon glyph="hand-left" /></h5>
                        <h5>Computational Mathematics <Glyphicon glyph="hand-left" /></h5>
                    </Col>
                </Row>
            </div>
        );
    }
});

module.exports = Header;
