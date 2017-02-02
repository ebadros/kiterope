var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ObjectList, ObjectListAndUpdate, FormAction, Sidebar } from './base'
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
var UpdatesList = require('./update');
var Modal = require('react-modal');
var DatePicker = require('react-datepicker');
var moment = require('moment');
require('react-datepicker/dist/react-datepicker.css');
import TinyMCE from 'react-tinymce';
import ValidatedInput from './app'
import autobind from 'class-autobind'

import { Caller, CallManager } from './call'



import { OTSession, OTPublisher, OTStreams, OTSubscriber, createSession } from 'opentok-react';


var theServer = 'https://192.168.1.156:8000/'

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

export class ProfileViewAndEditPage extends React.Component {

    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
        }
    }

    componentDidMount = () => {

        this.loadObjectsFromServer()

    }

    loadObjectsFromServer = () => {
        var theUrl = theServer + "api/myProfile"
        console.log(theUrl)
        $.ajax({
          url: theServer + "api/myProfile",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  data: data.results[0],})

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
          }.bind(this)
        });
      }




    render() {
            return (
                <div className="fullPageDiv">
                    <div className="ui page container">
                    <div className="spacer">&nbsp;</div>
                    <div className="ui alert"></div>
                    <div className="ui large breadcrumb">
                         <Link to={`/`}><div className="section">Home</div></Link>
                            <i className="right chevron icon divider"></i>
                            <Link to="myProfile"><div className=" section">Profile</div></Link>

                    </div>
                    <div>&nbsp;</div>
                        <ProfileView data={this.state.data}/>



 </div>
                     </div>
            )}

}



export class ProfileViewPage extends React.Component {

    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
        }
    }


    componentDidMount = () => {

        this.loadObjectsFromServer()

    }

    loadObjectsFromServer = () => {

        console.log("inside loadObjectsFromServer")
        var myUrl = theServer + "api/profiles/" + this.props.params.profile_id + "/"
        $.ajax({
          url: myUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  data: data,
              })



          }.bind(this),
          error: function(xhr, status, err) {
            console.error(myUrl, status, err.toString());
          }.bind(this)
        });
      }

    render() {


            return (

                <div className="fullPageDiv">
                    <div className="ui page container">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                        <div className="ui large breadcrumb">
                            <Link to={`/`}>
                                <div className="section">Home</div>
                            </Link>
                            <i className="right chevron icon divider"></i>
                                <div className=" section">Profile</div>

                        </div>
                        <div>&nbsp;</div>
                        <ProfileView data={this.state.data}/>

                    </div>
                </div>
            )
        }


}




export class ProfileView extends React.Component {
    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
            streams: []
        }
    }

    componentWillReceiveProps (nextProps)  {
            if (this.props.data != nextProps.data ) {
                    this.state.data = nextProps.data
                }

    }





    render() {

        return (
            <div>
                        <div className="ui four wide column header"><h1>Profile</h1></div>
<div className="ui top attached primary button" >
                                  Profile
                                </div>
                <div className="ui segment noTopMargin grid">

                <div className="four wide column">
                    <img className="ui image" src={this.state.data.profilePhoto}></img>
                    </div>

                        <div className="eight wide column">
                            <div className="row">
                                <h1> {this.state.data.firstName} {this.state.data.lastName} </h1>
                        </div>
                             <div className="row">

                            <div > {this.state.data.zipCode} </div>



                    </div>


                            <div className="row">

                            <div > {this.state.data.bio} </div>
                                </div>
                            </div>
                    <div className="four wide column">
                        <Caller userProfileBeingCalledId={this.state.data.id} />
                        </div>
                    <CallManager />
                    </div>
                {/*

<div>
        <OTPublisher session={this.sessionHelper.session} />

        {this.state.streams.map(stream => {
          return (
            <OTSubscriber
              key={stream.id}
              session={this.sessionHelper.session}
              stream={stream}
            />
          );
        })}
      </div>*/}
                    </div>

            )
    }
}



module.exports = { ProfileViewPage, ProfileView, ProfileViewAndEditPage }