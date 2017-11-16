var ReactDOM = require('react-dom');
var React = require('react');
var ReactRouter = require('react-router-dom');

var Website = require('./components/Website.react');

ReactDOM.render(
    <ReactRouter.BrowserRouter>
        <ReactRouter.Route path="/:page" component={Website}/>
    </ReactRouter.BrowserRouter>,
    document.getElementById('website')
);
