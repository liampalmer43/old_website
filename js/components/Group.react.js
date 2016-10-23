var React = require('react');

var Col = require('react-bootstrap/lib/Col');
var Row = require('react-bootstrap/lib/Row');
var Image = require('react-bootstrap/lib/Image');
var Panel = require('react-bootstrap/lib/Panel');
var Button = require('react-bootstrap/lib/Button');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');

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
        var emotions = this.props.emotions;
        var visionAPI = this.props.visionAPI;
        var emotionAPI = this.props.emotionAPI;
        var stories = this.props.stories;
        var instance = this.props.instance;
        
        var glyphs = [];
        if (visionAPI) {
            glyphs.push(<Glyphicon glyph="eye-open" key={1} />);
        } else {
            glyphs.push(<Glyphicon glyph="remove" key={1} />);
        }
        if (emotionAPI) {
            glyphs.push(<Glyphicon glyph="heart" key={2} />);
        } else {
            glyphs.push(<Glyphicon glyph="remove" key={2} />);
        }
        
        var displays = [];
        for (var i = 1; i < stories.length; ++i) {
            displays.push(<li key={i} className="diminish">{stories[i]}</li>);
        }
        return (
            <Panel header={name} bsStyle="info" className="group">
                <Row>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <Image rounded className="group_image" src={dataURL} />
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                        <Button className="center_button" onClick={this._generateStory.bind(this, instance)}>+</Button>
                        <div className="center_content">{glyphs}</div>
                        <hr />
                        <div className="scroll_div">
                            <p className="highlight">{stories[0]}</p>
                            <hr hidden={stories.length === 0} />
                            <ul>{displays}</ul>
                        </div>
                    </Col>
                </Row>
            </Panel>
        );
    },
});

module.exports = Group;
