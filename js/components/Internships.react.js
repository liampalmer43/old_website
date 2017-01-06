var React = require('react');
var Blog = require('./Blog.react');

var Internships = React.createClass({

    render: function() {
        image_paths = ["photos/UW.jpg", "photos/Adroll.png", "photos/Oracle.jpg", "photos/SideEffects.jpg"];
        titles = ["Research Assistant - UWaterloo", "AdRoll - San Francisco, CA", "Oracle Eloqua - Toronto, ON", "SideFX Software - Toronto, ON"];
        descriptions = ["As an undergraduate research assistant, I am contributing to the open source programming language Flix, which is currently being designed at the University of Waterloo to assist in computer program analysis.  So far my tasks have included implementing data structure libraries for various data types in Flix including Int8, Int16, Int32, Int64, BigInt, Float32, Float64, Option, Result, List and Set.",
                        "At AdRoll I worked on many aspects of their software.  One project involved using Apache Storm and DynamoDB to implement Impression Segments, a method of segmenting cookies based on previously shown impressions (advertisements).  Another project used Hadoop MapReduce and Java MD5 Hashing to find matching cookie sets within two independent cluster groups.",
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
