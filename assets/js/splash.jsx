var React = require('react');
var $  = require('jquery');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
import {DailyList } from './daily'
import {SearchPage} from './search'
import autobind from 'class-autobind'
import moment from 'moment';
import { Menubar } from './accounts'
import { addPlan, removePlan, setPlan, addStep, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'
import { StandardSetOfComponents, ErrorReporter } from './accounts'
import { theServer, s3IconUrl, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from './constants'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";
import { mapStateToProps, mapDispatchToProps } from './redux/containers'

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

@connect(mapStateToProps, mapDispatchToProps)
export class SplashPage extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            user: ""
        }

    }

    componentDidMount() {
        this.checkIfUser()
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
            success: function (theUser) {
                printObject(theUser)
                if (theUser.id != null) {
                    console.log("theUser != null")
                    this.setState({
                        user: theUser
                    })
                    store.dispatch(setCurrentUser(theUser))
                    hashHistory.push("/daily/")
                } else {
                    console.log("theUser == null")

                    hashHistory.push("/search/")

                }

            }.bind(this),
            error: function (xhr, status, err) {
                //store.dispatch(push('/search/'))
                hashHistory.push("/search/")
                //history.push('/search/')


                console.error(theUrl, status, err.toString());
            }
        })
    }



    render() {
        if (this.props.storeRoot.user) {
            return (<DailyList />)
        } else {
        return (<div></div>)
        }




    }
}

module.exports =  { SplashPage }