var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {FormAction, Sidebar } from './base'
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
var NotificationSystem = require('react-notification-system');
var Iframe = require("react-iframe");



import { OTSession, OTPublisher, OTStreams, OTSubscriber, createSession } from 'opentok-react';

import { theServer, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from './constants'


var notificationStyle = {
  NotificationItem: { // Override the notification item
    DefaultStyle: { // Applied to every notification, regardless of the notification level
        margin: '10px 5px 2px 1px',
        backgroundColor: 'white',
        borderColor: '#2185D0',
        boxShadow:  '#2185D0 0px 0px 1px',
        color: 'black',

    },

  }
}

export class Caller extends React.Component {
    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
        }
    }



    handleCallSubmit (call, callback)  {
    $.ajax({
        url: "api/sessions/",
        dataType: 'json',
        type: 'POST',
        data: call,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  }

    render() {

        return (
            <CallButton userProfileBeingCalledId={this.props.userProfileBeingCalledId} onCallSubmit={this.handleCallSubmit} />

        )
    }

}



export class CallButton extends React.Component {
    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
        }
    }

    componentDidMount() {
        $.ajax({
        url: "api/sessions/",
        dataType: 'json',
        type: 'GET',
        success: this.setState({
            authenticated: true
        }),
        error: function(xhr, status, err) {
            this.setState({
                authenticated: false
            })
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
    }
    handleCallClick = (event) => {

        event.preventDefault();
        if (this.state.authenticated) {

            var userProfileBeingCalledId = this.props.userProfileBeingCalledId;

            var formData = {
                userProfileBeingCalledId: userProfileBeingCalledId,
            }


            this.props.onCallSubmit(formData,
                function (data) {


                }.bind(this));
        }
        else {
            this.setState({
                modalIsOpen:true
            })
        }

    }


    render() {


        return (
            <div className="ui large purple fluid button" onClick={this.handleCallClick}>Call</div>

        )
    }
}

export class Call extends React.Component {
    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            callSessionId: "" ,
            callTokenId:"",
            modalIsOpen:true,
            streams:[],
        }
    }

    componentDidMount() {

    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
            this.setState({modalIsOpen:false});


    }

    componentWillUnmount() {
    this.sessionHelper.disconnect();
  }

    componentWillMount() {
        this.sessionHelper = createSession({
                        apiKey: '45757612',
                        sessionId: this.props.tokBoxSessionId,
                        token: this.props.tokBoxToken,
                        onStreamsUpdated: streams => {
                            this.setState({streams});
                        }
                    })
    }


      render() {
          return (

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
      </div>


    )
      }


}

export class CallManager extends React.Component {

    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            callSessionId:""
        }
    }

    declineCall(notificationId, sessionId) {
        event.preventDefault()
        this._notificationSystem.removeNotification(notificationId)
        this.removeNotification(notificationId)
        this.removeSessionForCall(sessionId)
    }

    removeNotification(notificationId) {
        $.ajax({
        url: ("api/notifications/" + notificationId + "/"),
        dataType: 'json',
        type: 'DELETE',
        //data: step,
        success: function() {

        },
        error: function(xhr, status, err) {
"Couldn't remove notification"
        }
    });
    }



    removeSessionForCall(sessionId) {
        $.ajax({
        url: ("api/sessions/" + sessionId + "/"),
        dataType: 'json',
        type: 'DELETE',
        //data: step,
        success: function() {

        },
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }
    });
    }

    acceptCall(notificationId,sessionId) {
        event.preventDefault()
        $.ajax({
            url: "api/sessions/" + sessionId + "/",
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({
                        callSessionId: data.tokBoxSessionId,
                        callToken: data.tokBoxToken,

                    })



            }.bind(this),
            error: function (xhr, status, err) {
                console.error("https://127.0.0.1:8000/api/sessions/", status, err.toString());
            }.bind(this)
        });

    }

    createNotification(notificationId,sessionId) {
        this._notificationSystem.addNotification({
      message: 'Incoming Call',
      level: 'success',
        autoDismiss:0,
        dismissible:false,
        uid:notificationId,
        action: {
    label: 'Button name',
    callback: function() {
    }
  },

        children: (
    <div className="ui center aligned grid">
        <div className="ui row"><div className="ui small circular image">
            <img  src='https://semantic-ui.com/images/avatar2/large/kristy.png'></img></div>
            </div>
        <div className="ui row header">
            <h1>Johnny Appleseed</h1>
            </div>
        <div className="ui row">
            <div className="eight wide column">
                <div className="ui fluid red button" onClick={() => this.declineCall(notificationId, sessionId)}>Decline</div>
                </div>
            <div className="eight wide column">
                <div className="ui fluid green button" onClick={() => this.acceptCall(notificationId, sessionId)}>Accept</div>
                </div>

    </div>
        </div>
  )
    });

    }


    componentDidMount() {
        var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        this.setState({intervalID:intervalID});
        this._notificationSystem = this.refs.notificationSystem;

    }
    componentWillUnmount() {
        clearInterval(this.state.intervalID)
    }

    loadObjectsFromServer = () => {
        $.ajax({
          url: "api/notifications/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  data:data.results,

                  }, this.updateNotifications);

          }.bind(this),
          error: function(xhr, status, err) {
            console.error("https://127.0.0.1:8000/api/notifications/", status, err.toString());
          }.bind(this)
        });
      }

      updateNotifications() {
          var notifications = this.state.data
          for (var i=0; i < notifications.length; i++) {
              this.createNotification(notifications[i].id, notifications[i].call)
          }
      }

      render() {
          if (this.state.callSessionId) {
              var theCall = <Call tokBoxSessionId={this.state.callSessionId} tokBoxToken={this.state.callToken}/>
          }

          return (
              //<div className="ui divided link items">
              <div>
                  {theCall}

                          <NotificationSystem ref="notificationSystem"  style={notificationStyle} />

              </div>
          )
      }
}


