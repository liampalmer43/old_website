var React = require('react');

var Col = require('react-bootstrap/lib/Col');
var Row = require('react-bootstrap/lib/Row');
var Image = require('react-bootstrap/lib/Image');
var Panel = require('react-bootstrap/lib/Panel');

var BlogPost = React.createClass({

  render: function() {
    var image_path = this.props.image_path;
    var description = this.props.description;
    var title = this.props.title;

    return (
        <div className="blog_post">
            <h1 className="center blogPostHeader">{title}</h1>
            <Row>
                <Col xs={6} sm={6} md={6} lg={6}>
                    <Image rounded className="blog_image" src={image_path} />
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                    <p className="text_justify">{description}</p>
                </Col>
            </Row>
        </div>
    );
  }

});

module.exports = BlogPost;
