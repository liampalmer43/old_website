var React = require('react');
var Blog = require('./Blog.react');

var Coding = React.createClass({

    render: function() {
        image_paths = ["photos/HackHolyoke.jpg", "photos/PSU.jpg", "photos/HackHarvard.jpg", "photos/Fotag.png", "photos/Doodle.png", "photos/Breakout.png"];
        titles = ["Hack Holyoke - Holyoke, MA", "Hack PSU - State College, PA", "Hack Harvard - Cambridge, MA", "Photo Rating - Java App", "Drawing Board - Java App", "Breakout Game - Java App"];
        descriptions = ["Used ReactJS and AWS S3 to build giddit.io, a site for sharing and searching for unique advice.  Winner of Best AWS Hack Prize (two-person team).",
                        "Used ReactJS and three APIs to create a workflow for growing your own food based on local gardeners and climate data.  Winner of Food for Thought Prize (three-person team).",
                        "Leveraged ReactJS and Microsoft’s Computer Vision and Emotion APIs to generate short stories based on a photograph (solo project).",
                        "", "", ""]
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
