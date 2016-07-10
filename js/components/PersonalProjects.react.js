var React = require('react');
var Blog = require('./Blog.react');

var PersonalProjects = React.createClass({

    render: function() {
        image_paths = ["photos/OotM.jpg", "photos/GoogleGames.jpg", "photos/U22.jpg", "photos/U21WC.jpg", "photos/UW.jpg", "photos/U18.jpg"];
        titles = ["OotM World Finals", "Google Games", "U22 National Champs", "U21 World Championships", "University of Waterloo", "U18 National Champs"];
        descriptions = ["2nd Place in Problem 3, Division IV",
                        "2nd Place as The Mathies",
                        "Beach Volleyball Nationals at Toronto",
                        "Beach Volleyball Worlds at Cyprus",
                        "Computer Science, Applied and Computational Math",
                        "Beach Volleyball Nationals at Vancouver"];
        data_posts = [];
        for (var i = 0; i < image_paths.length; ++i) {
            data_posts.push({image_path:image_paths[i], title:titles[i], description:descriptions[i]});
        }
        return (
            <Blog data_posts={data_posts}></Blog>
        );
    }
});

module.exports = PersonalProjects;
