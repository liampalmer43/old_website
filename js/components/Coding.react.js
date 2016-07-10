var React = require('react');
var Blog = require('./Blog.react');

var Coding = React.createClass({

    render: function() {
        image_paths = ["photos/Fotag.png", "photos/Doodle.png", "photos/Breakout.png"];
        titles = ["Photo Rating - Java App", "Drawing Board - Java App", "Breakout Game - Java App"];
        descriptions = ["", "", ""]
        data_posts = [];
        for (var i = 0; i < image_paths.length; ++i) {
            data_posts.push({image_path:image_paths[i], title:titles[i], description:descriptions[i]});
        }
        return (
            <Blog data_posts={data_posts}></Blog>
        );
    }
});

module.exports = Coding;
