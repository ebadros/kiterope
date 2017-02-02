var React = require('react');
var $  = require('jquery');
var $ui = require('jquery-ui');


var DatePicker = React.createClass({
    _destroyDatePicker: function() {
        var element = this.getDOMNode();
        $(element).datepicker('destroy');
    },

    _initDatePicker: function() {
        var element = this.getDOMNode();
        // or in >= 0.13
        // var element = React.findDOMNode(this);
        $(element).datepicker(this.props);
    },

    componentDidMount: function() {
        this._initDatePicker();
    },

    componentWillReceiveProps: function(props) {
        // could be optimized better to invoke functions on
        // active plugin based on property values
        this._destroyDatePicker();
    },

    componentDidUpdate: function() {
        this._initDatePicker();
    },

    componentWillUnmount: function() {
        this._destroyDatePicker();
    },

    render: function() {
        return <input type="text" {...this.props}/>
    }
});



module.exports = DatePicker;