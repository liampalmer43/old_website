var React = require('react');
var BlogPost = require('./BlogPost.react');

var Blog = React.createClass({

  render: function() {
    var data_posts = this.props.data_posts;
    var blog_posts = [];
    for (var i = 0; i < data_posts.length; ++i) {
        blog_posts.push(<BlogPost key={i} image_path={data_posts[i].image_path} title={data_posts[i].title} description={data_posts[i].description}></BlogPost>);
    }
    return (
        <div className="blog">
            {blog_posts}
        </div>
    );
  }

});

module.exports = Blog;
