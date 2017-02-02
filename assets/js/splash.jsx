var React = require('react');
var $  = require('jquery');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var DailyList = require('./daily');
var SearchPage = require('./search')
import autobind from 'class-autobind'
import moment from 'moment';

var theServer = 'https://192.168.1.156:8000/'


export class SplashPage extends React.Component {
    constructor (props) {
        super(props)
        autobind(this)
        this.state  = {
            authenticated:false,
        }

    }

    componentDidMount () {
        this.loadObjectsFromServer()
    }

    loadObjectsFromServer () {
        var periodRangeStart = new Date();
        var periodRangeEnd = new Date();
        periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        $.ajax({
            url: theServer + "api/period/" + periodRangeStart + "/" + periodRangeEnd + "/",
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({
                    authenticated:true
                });


            }.bind(this),
            error: function (xhr, status, err) {
                this.setState ({
                    authenticated:false
                })
                hashHistory.push("/search/")
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    render () {
        if (this.state.authenticated) {
            return (
                <DailyList />
                )
            }
        else {
            return(<div></div>)
        }

    }

}

module.exports = SplashPage