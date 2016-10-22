var ReactDOM = require('react-dom');
var React = require('react');

var Website = require('./components/Website.react');
var Idea = require('./components/Idea.react');

ReactDOM.render(
    <Idea />,
    document.getElementById('website')
);
