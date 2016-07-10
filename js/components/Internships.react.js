var React = require('react');
var Blog = require('./Blog.react');

var Internships = React.createClass({

    render: function() {
        image_paths = ["photos/Adroll.png", "photos/Oracle.jpg", "photos/SideEffects.jpg"];
        titles = ["AdRoll - San Francisco, CA", "Oracle Eloqua - Toronto, ON", "Side Effects Software - Toronto, ON"];
        descriptions = ["Advertising retargeting technology - Advertisables, Campaigns, AdGroups, Segments and more...",
                        "At Oracle I built a wizard style application to help developers and users learn Oracle Eloqua's Bulk API 2.0.  This project used React Javascript with the Flux Application Architecture.",
                        "At Side Effects Software I implemented several new features for the ragdoll authoring tools in Houdini's dynamics environment. These projects included an interactive tool for creating a character's collision geometry, a viewport handle for manipulating cones with non-uniform angles, an interactive tool for configuring the rotation limits of a ragdoll's joints, and a tool for initializing a ragdoll's joint limits from a set of animation clips."];
        data_posts = [];
        for (var i = 0; i < image_paths.length; ++i) {
            data_posts.push({image_path:image_paths[i], title:titles[i], description:descriptions[i]});
        }
        return (
            <Blog data_posts={data_posts}></Blog>
        );
    }
});

module.exports = Internships;
