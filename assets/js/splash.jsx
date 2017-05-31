var React = require('react');
var $  = require('jquery');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var DailyList = require('./daily');
var SearchPage = require('./search')
import autobind from 'class-autobind'
import moment from 'moment';
import { Menubar } from './accounts'




import { theServer, s3IconUrl, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from './constants'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'


function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}


import { Provider, connect, dispatch } from 'react-redux'

import  {store} from "./redux/store";


@connect(mapStateToProps, mapDispatchToProps)
export class SplashPage extends React.Component {
    constructor (props) {
        super(props)
        autobind(this)
        this.state  = {
            authenticated:false,
            user:true
        }

    }

    componentDidMount () {
        this.checkIfUser()

       //this.loadObjectsFromServer()
    }



    checkIfUser() {
        var theUrl = 'api/users/i/'
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(theUser) {
                this.setState({
                    user:theUser
                })
                this.props.setCurrentUser(theUser)
            }.bind(this),
            error: function(xhr, status, err) {
                //store.dispatch(push('/search/'))
                hashHistory.push("/search/")
                //history.push('/search/')



                console.error(theUrl, status, err.toString());
        }
        })
    }



    loadObjectsFromServer () {
        var periodRangeStart = new Date();
        var periodRangeEnd = new Date();
        periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');

        var tempUrl = "api/period/2016-11-16/2017-05-01/"
        var theUrl = "api/period/" + periodRangeStart + "/" + periodRangeEnd + "/"
        $.ajax({
            url: tempUrl,
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
                console.error(tempUrl, status, err.toString());
            }.bind(this)
        });
    }

    render () {
        if (this.state.user) {
            return (
                <DailyList />
                )
            }
        else {
            return(<div>asdfasdfasdf</div>)
        }

    }

}

module.exports =  { SplashPage}