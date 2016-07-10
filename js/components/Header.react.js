var React = require('react');
var NavigationActions = require('../actions/NavigationActions');
var NavigationConstants = require('../constants/NavigationConstants');
var Button = require('react-bootstrap/lib/Button');
var Col = require('react-bootstrap/lib/Col');
var Row = require('react-bootstrap/lib/Row');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');

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

    render: function() {
        return (
            <div className="header">
                <Row>
                    <Col xs={4} sm={4} md={4} lg={4} className="header_left">
                        <ButtonToolbar>
                            <Button onClick={this._personalProjects} bsStyle="primary">ADVENTURES</Button>
                            <Button onClick={this._internships} bsStyle="primary">INTERNSHIPS</Button>
                            <Button onClick={this._coding} bsStyle="primary">CODING</Button>
                        </ButtonToolbar>
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
