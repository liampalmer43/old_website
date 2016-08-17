var React = require('react');

var Image = require('react-bootstrap/lib/Image');
var NavigationStore = require('../stores/NavigationStore');
var NavigationConstants = require('../constants/NavigationConstants');

function getState() {
    return {
        websiteState: NavigationStore.getState()
    };
}

var MenuItem = React.createClass({

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        NavigationStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        NavigationStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var image_path = this.props.image_path;
        var selected = this.state.websiteState === this.props.state;
        var title = this.props.title;
        var onclick = this.props.onclick;
        return (
            <div className="menu_item float_left">
                <Image src={image_path} className="menu_item_image" circle onClick={onclick}/>
                <p className="menu_item_text">{title}</p>
                { selected ? <div className="selector" /> : null }
            </div>
        );
    },

    _onChange: function() {
        this.setState(getState());
    }
});

module.exports = MenuItem;
