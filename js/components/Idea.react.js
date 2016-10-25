var React = require('react');
var IdeaStore = require('../stores/IdeaStore');
var IdeaConstants = require('../constants/IdeaConstants');
var IdeaActions = require('../actions/IdeaActions');

var Button = require('react-bootstrap/lib/Button');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
var ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
var Glyphicon = require('react-bootstrap/lib/Glyphicon');
var Col = require('react-bootstrap/lib/Col');
var Row = require('react-bootstrap/lib/Row');

var Group = require('./Group.react');

function getState() {
    return {
        groups: IdeaStore.getState(),
        gangster: IdeaStore.getGangster(),
        template: IdeaStore.getTemplate()
    };
}

function drawImageScaled(img, ctx) {
   var canvas = ctx.canvas ;
   var hRatio = canvas.width  / img.width    ;
   var vRatio =  canvas.height / img.height  ;
   var ratio  = Math.min ( hRatio, vRatio );
   var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
   var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
   ctx.clearRect(0,0,canvas.width, canvas.height);
   ctx.drawImage(img, 0,0, img.width, img.height,
                      centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
}

var Idea = React.createClass({

    _image: function(name) {
console.log(name);
        // Create an image holding the photo.
        var image = document.createElement('img');
        image.setAttribute('crossOrigin', 'anonymous');
        image.onload = function() {
            // Create a canvas that will be displayed in the DOM.
            var canvas = document.createElement('canvas');
            canvas.width = 305;
            canvas.height = 305;
            var context = canvas.getContext('2d');
            // Fit/scale the image to the canvas appropriately.
            drawImageScaled(image, context);

            // Send the base64 encoding of the photo to the model.
            var dataURL = canvas.toDataURL("image/png");
            IdeaActions.sendImageData([name, dataURL]);
        };
        image.setAttribute("src", "photos/" + name);
    },

    _initialPicture: function() {
        var names = ["bear.jpg", "elephant.jpg", "dolphin.jpg", "baby.jpg"];
        for (var i = 0; i < names.length; ++i) {
            this._image(names[i]);
        }
    },
    
    _newPicture: function() {
        var input = document.getElementById("storyInput");
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var name = input.files[0].name;
            reader.onload = function (e) {
                // Create an image holding the uploaded photo.
                var image = document.createElement('img');
                image.setAttribute("src", e.target.result);

                // Create a canvas that will be displayed in the DOM.
                var canvas = document.createElement('canvas');
                canvas.width = 305;
                canvas.height = 305;
                var context = canvas.getContext('2d');
                // Fit/scale the image to the canvas appropriately.
                drawImageScaled(image, context);

                // Send the base64 encoding of the photo to the model.
                var dataURL = canvas.toDataURL("image/png");
                IdeaActions.sendImageData([name, dataURL]);
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    _gangster: function() {
        IdeaActions.setGangster(!this.state.gangster);
    },

    _template: function() {
        IdeaActions.setTemplate(!this.state.template);
    },

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        IdeaStore.addChangeListener(this._onChange);
        this._initialPicture();
    },

    componentWillUnmount: function() {
        IdeaStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var groups = this.state.groups;
        var gangster = this.state.gangster;
        var template = this.state.template;
        var displays = [];
        for (var i = 0; i < groups.length; ++i) {
            displays.push(
            <Group key={i} instance={i} name={groups[i]["name"]} dataURL={groups[i]["dataURL"]} association={groups[i]["association"]}
                   stories={groups[i]["stories"]} emotions={groups[i]["emotions"]} visionAPI={groups[i]["visionAPI"]} emotionAPI={groups[i]["emotionAPI"]} />);
        }
        return (
            <div>
                <div className="customizer">
                    <Row>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <input id="storyInput" type="file" onChange={this._newPicture} name="INPUT" />
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4}>
                            <p className="title">PictoStory!</p>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2}>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={2}>
                            <ButtonToolbar>
                                <ButtonGroup>
                                    <Button className="float_right" onClick={this._gangster} bsStyle={gangster ? "primary" : "danger"}><Glyphicon glyph="cd" /></Button>
                                    <Button className="float_right" onClick={this._template} bsStyle={template ? "primary" : "danger"}><Glyphicon glyph="road" /></Button>
                                </ButtonGroup>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </div>
                <div>{displays}</div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getState());
    }
});

module.exports = Idea;
