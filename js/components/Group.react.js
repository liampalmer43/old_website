var React = require('react');

var Col = require('react-bootstrap/lib/Col');
var Row = require('react-bootstrap/lib/Row');
var Image = require('react-bootstrap/lib/Image');
var Panel = require('react-bootstrap/lib/Panel');
var Button = require('react-bootstrap/lib/Button');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');

var Image = require('react-bootstrap/lib/Image');
var IdeaActions = require('../actions/IdeaActions');

var Group = React.createClass({
    _generateStory: function(instance) {
        IdeaActions.generateStory(instance);
    },

    render: function() {
        var name = this.props.name;
        var dataURL = this.props.dataURL;
        var association = this.props.association;
        var stories = this.props.stories;
        var instance = this.props.instance;

        var displays = [];
        for (var i = 0; i < stories.length; ++i) {
            displays.push(<li key={i}>{stories[i]}</li>);
        }
        return (
            <Panel header={name} bsStyle="info" className="group">
                <Row>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <Image rounded className="group_image" src={dataURL} />
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <Button className="center_button" onClick={this._generateStory.bind(this, instance)}>+</Button>
                        <hr />
                        <ul>{displays}</ul>
                        <p className="text_justify">{}</p>
                    </Col>
                </Row>
            </Panel>
        );
    },
});

module.exports = Group;
