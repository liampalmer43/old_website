var React = require('react');
var Blog = require('./Blog.react');

var PersonalProjects = React.createClass({

    render: function() {
        image_paths = ["photos/OotM.jpg", "photos/GoogleGames.jpg", "photos/U22.jpg", "photos/U21WC.jpg", "photos/UW.jpg", "photos/U18.jpg"];
        titles = ["OotM World Finals", "Google Games", "U22 National Champs", "U21 World Championships", "University of Waterloo", "U18 National Champs"];
        descriptions = ["Achieved 2nd Place in Classics Problem, University Division.  Odyssey of the Mind is an international creative problem solving program that requires teams to solve challenges that range from building mechanical devices to presenting their own interpretation of literary classics.  In 2016, the University of Waterloo presented one of Aesop's fables going viral in the past only to then cause critical scientific phenomenon that ultimately lead to the existance of human life.",
                        "Achieved 2nd Place as The Mathies.  The Google Games combined problem solving and fun in four main challenges: Trivia, Logic Problems, Word Association and Programming.  The Mathies pulled off victories in Trivia and Word Assosiation to take second overall in a field of 15 teams.",
                        "My beach volleyball partner and I placed first in the U22 division at the Beach Volleyball National Championships in Toronto, ON, Canada.",
                        "My beach volleyball partner and I represented Canada at the U21 Beach Volleyball World Championships in Larnaca, Cyprus.",
                        "Majoring in Computer Science, Applied Math and Computational Math.  Scholarhips to date include the Ronald G. Scoins National Scholarship for distinguished results in mathematics competitions, the R.A.Wentzell Scholarship for top marks in Applied Mathematics, the Computational Mathematics Upper Year Scholarship for top marks in Computational Mathematics, and the Electrohome 75th Anniversary Scholarship for academic performance in Computer Science.",
                        "My beach volleyball partner and I placed first in the U18 division at the Beach Volleyball National Championships in Vancouver, BC, Canada."];
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
