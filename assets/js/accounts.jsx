var React = require('react');
var $  = require('jquery');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

//import Datepicker from './Datepicker';
var Datetime = require('react-datetime');

import DatePicker  from 'react-datepicker';
import moment from 'moment';
var TinyMCE = require('react-tinymce-input');
var MaskedInput = require('react-maskedinput');
import autobind from 'class-autobind'
var validator = require('validator');
import TimePicker from 'rc-time-picker';
import DynamicSelectButton2 from './base'
var Select = require('react-select');
import  { ValidatedInput, KRCheckBox } from './app'
var auth = require('./auth');
var Modal = require('react-modal');
import {MessageWindowContainer} from './message'

import { Sidebar, SidebarWithoutClickingOutside } from './sidebar'
import Global from 'react-global';

import { setCurrentUser, setPlans,  reduxLogout, setProfile, setSettings, setForMobile, showSidebar, setContacts, setMessageWindowVisibility, setOpenThreads, setGoals, setPrograms, setMessageThreads,  setStepOccurrences } from './redux/actions'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers'
//var sb = new SendBird({
//    appId: '36A8769D-9595-4CB5-B27C-47E0574CD7C7'
//});

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}
var ReconnectingWebSocket = require('reconnecting-websocket');
var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

import { Provider, connect, dispatch } from 'react-redux'


// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

var UpdatesList = require('./update');

import { theServer, s3IconUrl, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from './constants'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'



$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});

const customStyles = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '10%',
    left                  : '30%',
    right                 : '30%',
    bottom                : '10%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'
  }
};

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

@connect(mapStateToProps, mapDispatchToProps)
export class ReduxDataGetter extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            width:'0',
            height:'0'



        }
    }

    componentDidMount = () => {
        store.dispatch(setMessageWindowVisibility(false));
          this.updateWindowDimensions();
          window.addEventListener('resize', this.updateWindowDimensions);


        if (this.props.storeRoot.user == undefined) {

            this.loadUserData()
        }


    };

    componentWillUnmount() {
  window.removeEventListener('resize', this.updateWindowDimensions);
}

updateWindowDimensions() {
  this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (window.innerWidth >= 768 ) {
        store.dispatch(setForMobile(false))
    } else {
                store.dispatch(setForMobile(true))

    }
}

    loadUserData() {
        var theUrl =  '/api/users/i/';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(userData) {
                if (userData.id != null) {
                store.dispatch(setCurrentUser(userData));
                this.loadUniversalData();
                    this.setUsersTimezone(userData.profileId);

                if (userData.isCoach) {
                    this.loadCoachSpecificData()

                }
            }

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        })
    }

    loadProfileData() {
        var theUrl =  '/api/profiles/me/';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(profileData) {
                store.dispatch(setProfile(profileData));



            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        })

    }

    loadSettingsData() {
        var theUrl =  '/api/settings/me/';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(settingsData) {
                store.dispatch(setSettings(settingsData));



            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        })

    }

    setUsersTimezone(userProfileId) {
        console.log("set users timezone");
        var theUrl = '/api/profiles/' + userProfileId + "/";
        var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        $.ajax({
            method: 'PATCH',
            url: theUrl,
            datatype: 'json',
            data:{timezone: timezone},
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {



            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        })

    }

    loadUniversalData() {
        this.loadProfileData();
        this.loadSettingsData();
        this.loadMessageThreadData();
        this.loadContactData();
        this.loadGoalData();
        this.loadStepOccurrenceData();
        this.loadPlanData()
    }



    loadCoachSpecificData() {
        this.loadProgramData()

    }

    loadGoalData() {

        var theUrl = "/api/goals/";
        $.ajax({
      url: theUrl,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
                  store.dispatch(setGoals(data))

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());

      }.bind(this),

    });

    }

    loadPlanData() {

        var theUrl = "/api/planOccurrences/";
        $.ajax({
      url: theUrl,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
                  store.dispatch(setPlans(data))

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());

      }.bind(this),

    });

    }

    loadProgramData() {
        var theUrl = "/api/programs/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                store.dispatch(setPrograms(data))

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());

            }.bind(this),

        });
    }

    loadMessageThreadData ()  {


        //sb.connect('eric@kiterope.com', '06acb152950c651a173c7c4425856ef7317281d3', function(user, error) {});


        var theUrl = '/api/messageThreads/';

    $.ajax({
      url: theUrl ,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
          store.dispatch(setMessageThreads(data));
          store.dispatch(setOpenThreads({}))


      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());
      }.bind(this),

    });
  }



    loadStepOccurrenceData() {
        var periodRangeStart = new Date();
        var periodRangeEnd = new Date();
        periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        var theUrl = "/api/period/" + periodRangeStart + "/" + periodRangeEnd + "/";

        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
          store.dispatch(setStepOccurrences(data.results))

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this)
        });
    }


    loadContactData() {
        var theUrl = "/api/contacts/";
        $.ajax({
      url: theUrl,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
          this.organizeContacts(data)

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());

      }.bind(this),

    });



    }

    organizeContacts(theContactData) {
        var theContacts = {};
        if (this.props.storeRoot) {
            if (this.props.storeRoot.user) {
                for (var key in theContactData) {
                    if (theContactData[key].receiverProfile.user == this.props.storeRoot.user.id) {
                        var theSender = theContactData[key].senderProfile;

                        var theContactId = theContactData[key].id;
                        theContacts[theContactId] = theSender;


                        //theContacts.push({theContactId: theContactData[key].sender})

                    } else {
                        var theReceiver = theContactData[key].receiverProfile;

                        var theContactId = theContactData[key].id;
                        theContacts[theContactId] = theReceiver

                    }
                }

                store.dispatch(setContacts(theContacts))


            }
        }

    }

    render() {
        return (<div></div>)
    }




}


@connect(mapStateToProps, mapDispatchToProps)
export class StandardSetOfComponents extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            user:"",
            modalIsOpen:false,
            form:"SignIn",
            signInOrSignUpModalFormIsOpen:false,


        }
    }

    componentDidMount () {
        $(this.refs["ref_messageWindowContainer"]).hide();
        var date = new Date();
        console.log("date to string " + date.toString());
                console.log("date to local string " + date.toLocaleString());

        var offsetInHours = date.getTimezoneOffset() / 60;
        console.log("offset is " + offsetInHours)
    }



    componentWillReceiveProps (nextProps) {
        if (this.state.signInOrSignUpModalFormIsOpen != nextProps.modalIsOpen) {
            this.setState({
                signInOrSignUpModalFormIsOpen: nextProps.modalIsOpen,
            })
        }
    }



    handleModalClosed = () =>  {
        this.props.modalShouldClose();
        this.setState({
            signInOrSignUpModalFormIsOpen:false,
            refreshUser:true,
        }, this.noNeedToRefreshUser())
    };

    noNeedToRefreshUser() {
        this.setState({
            refreshUser: false,
        })
    }







    render() {
        if (this.props.storeRoot.gui.isMessageWindowVisible == true) {
            $(this.refs["ref_messageWindowContainer"]).show();
            $(this.refs["ref_messageRoundButton"]).hide()

        } else if (this.props.storeRoot.gui.isMessageWindowVisible == false) {
            $(this.refs["ref_messageWindowContainer"]).hide();
            $(this.refs["ref_messageRoundButton"]).show()

        }

        return (

            <div>
                <ReduxDataGetter />

                <div ref="ref_messageWindowContainer"><MessageWindowContainer /></div>
                <MessageButton />


            <SignInOrSignUpModalForm modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} modalShouldClose={this.handleModalClosed} />
            <Menubar shouldRefresh={this.state.refreshUser} /></div>
        )
    }
}

export class Footer extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {

        }
    }
    render() {
        return (
            <div>
                <div className="footerSpacer">&nbsp;</div>
                <div className="customFooter">
                    <div className="ui six column center aligned stackable grid">

<div className="ui column">&nbsp;</div>
                        <div className="ui column">&nbsp;</div>
                        <div className="ui column"><a >Contact Us</a></div>
                        <div className="ui column"><Link to="/tos">Terms</Link></div>

                        <div className="ui column">&nbsp;</div>
                        <div className="ui column">&nbsp;</div>
                        </div>
                                        <div className="ui one column center aligned stackable grid">


                        <div className="ui column">Copyright © 2017 Kiterope Inc.</div>
</div>


                        </div>
                    </div>
    )
    }
}


export class NotificationManager extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            notificationRoomLabel:""

        }
    }


    componentWillReceiveProps = (nextProps) => {
        if (this.state.notificationRoomLabel != nextProps.notificationRoomLabel) {

            this.setState({
                notificationRoomLabel: nextProps.notificationRoomLabel
            });
            this.connectToRoomWebsocket(nextProps.notificationRoomLabel)

        }

    };
    connectToRoomWebsocket(theRoomLabel) {
        var chat_socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/notifications" + "/" + theRoomLabel);
        chat_socket.onmessage = (message) => {
        var data = JSON.parse(message.data);
        };


    }


    componentDidMount = () => {
        console.log("notification Manager componentDidMount");
            this.setState({
                notificationRoomLabel: this.props.notificationRoomLabel
            });
        if (this.props.notificationRoomLabel != undefined) {
            this.connectToRoomWebsocket(this.props.notificationRoomLabel)
        }



    };

    render() {
        return (

            <div className="ui button item" onClick={this.handleNotificationClick} ><i className="large mail outline icon" style={{margin:0}}  /></div>

        )
    }
}


@connect(mapStateToProps, mapDispatchToProps)
export class Menubar extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
        }


    }

    componentDidMount() {

    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.storeRoot != nextProps.storeRoot) {
            this.setState({
                storeRoot:nextProps.storeRoot
            })
        }
    };

    loadUserData() {
        var theUrl = '/api/users/i';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                if (res.id != null) {
                    this.setState({
                        'user': res
                    });

                    store.dispatch(setCurrentUser(res))
                }

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        })
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.shouldRefresh == true) {
            //this.loadUserData()
        }
    }



    loginHandler() {
                      store.dispatch(push('/account/login/'))
    }

    joinKiteropeHandler() {
        store.dispatch(push('/joinKiterope'))
    }

    logoutHandler() {
        console.log("logout");
        store.dispatch(reduxLogout());

        auth.logout();
                        store.dispatch(push('/account/login/'))




    }



    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {

            this.setState({
                modalIsOpen: false,
            });


    }
    handleSidebarClick (e) {
        if(this.props.storeRoot.gui.isSidebarVisible)  {
                    store.dispatch(showSidebar(false))


        } else {
                    store.dispatch(showSidebar(true))


        }


    }

    goToBlog() {
        store.dispatch(push('/blog'))

    }
//


    render() {

        if (!this.props.storeRoot.user) {
            var loginUI =  <div className="right menu">
                                  <button className="ui button item" onClick={this.goToBlog}>Blog</button>


                  <button className="ui button item" onClick={this.joinKiteropeHandler}>Join Kiterope</button>
                  <button className="ui button item" onClick={this.loginHandler}>Sign In</button>
              </div>

        } else {
            var loginUI = <div className="right menu">

                <div ref="ref_sidebar_menuButton" className="ui button item" onClick={this.handleSidebarClick} ><i className="large sidebar icon" style={{margin:0}}  /></div>

                <div className="ui simple dropdown item" >
                    { this.props.storeRoot.user.profilePhoto ? <div className="ui extratiny circular image"><img src={s3ImageUrl + this.props.storeRoot.user.profilePhoto} /> </div>: <img src="/static/images/avatar-placeholder.png" />}
                    {/*<div className="username">{this.props.storeRoot.user.username}</div>*/}

                      <div className="menu">
                          <button className="ui button fluid item" onClick={this.logoutHandler}>Logout</button>
                      </div>
                  </div>
                                <div className="ui simple dropdown item">&nbsp;</div>


              </div>
        }

        return (

             <div className="ui fixed top inverted blue menu onTop menuShortener" style={{marginTop:0,}}>
          <div><a href="/" id="logo"><img style={{marginLeft: 1 + 'rem', marginTop: 1 + 'rem'}} height="50"
                                src="/static/images/kiterope_logo_v01.png" /></a></div>
                 {loginUI}
                 <SidebarWithoutClickingOutside sidebarVisibilityChange={this.handleSidebarVisibilityChange} visible={this.props.storeRoot.gui.isSidebarVisible} user={this.props.storeRoot.user} />

      </div>
        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class MessageButton extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            modalIsOpen:false,
            form:"SignIn"
        }
    }

    showMessageWindow() {
        store.dispatch(setMessageWindowVisibility(true))

    }

    render () {
        if (this.props.storeRoot.gui.isMessageWindowVisible) {
                    $(this.refs["ref_messageRoundButton"]).hide()


        } else {
                    $(this.refs["ref_messageRoundButton"]).show()

        }
        if (this.props.storeRoot.user){
            return (
                <div ref="ref_messageRoundButton" onClick={this.showMessageWindow}>
                    {this.props.storeRoot.gui.openThreads ?
                    <div className="notificationSignal"/> : <div></div>}
                    <div className="floatingRoundButton"><i className=" big mail outline inverted icon"
                                                            style={{marginLeft: 19, marginTop: 20}}/></div>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }

}
@connect(mapStateToProps, mapDispatchToProps)
export class SignInOrSignUpModalForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            modalIsOpen:false,
            form:"SignIn"
        }
    }
        handleError = (theError) => {
        this.setState({
            error:theError,
        })

    };


    componentDidUpdate() {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.sizeDialog);
    }
    else {
      // IE <10 CYA - Note: I haven't actually tested this in IE - YMMV
      window.setTimeout(this.sizeDialog, 50);
    }
  }

  sizeDialog = () => {
    if (!this.refs.content) return;
    let contentHeight = this.refs.content.getBoundingClientRect().height;
    this.setState({
      contentHeight: contentHeight,
    });
  };
    componentWillReceiveProps(nextProps) {
        if (this.state.modalIsOpen != nextProps.modalIsOpen) {
            this.setState({
                modalIsOpen:nextProps.modalIsOpen,
            })
        }
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal = () => {
        this.props.modalShouldClose();

            this.setState({
                modalIsOpen:false,

                form: "SignIn"


            });

    };

    handleFormChange(theSelectedForm) {

        this.setState({
            form: theSelectedForm.form

        })

    }


  render() {

      const padding = 90; // adjust this to your needs
    let height = (this.state.contentHeight + padding);
    let heightPx = height + 'px';
    let heightOffset = height / 2;
    let offsetPx = heightOffset + 'px';

    const style = {
        overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

      content: {
        border: '0',
        borderRadius: '4px',
        bottom: 'auto',
        height: heightPx,  // set height
        left: '30%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '10%', // start from center
        transform: 'translate(-50%,-' + offsetPx + ')', // adjust top "up" based on height
        width: '40%',
        maxWidth: '40rem'
      }
    };
      var theForm = "";
      if (this.state.form == "Join") {
          theForm = <ModalJoinForm selectedForm={this.handleFormChange}/>
      } else if (this.state.form == "SignIn") {
          theForm = <ModalLoginForm selectedForm={this.handleFormChange} />
      } else if (this.state.form == "ForgotPassword") {
          theForm = <ModalPasswordResetForm selectedForm={this.handleFormChange} />
      } else if (this.state.form == "None") {
          this.closeModal()
      }
      return(
          <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={style} >

      {theForm}
              </Modal>


      )
  }
}




export class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {

        }

  }

    handleError = (theError) => {
        this.setState({
            error:theError,
        })

    };


  render() {
      return(
          <div>
    <Menubar />
          <div className="ui text container">
              <div className="fullPageDiv">
                  <div className="spacer">&nbsp;</div>
                  <div className="spacer">&nbsp;</div>
                  <div className="ui two column stackable grid">
                      <LoginForm  />
                      <div className="ui eight wide column">
                          <div className="massiveType">
                              10 minutes a day is better than 90 minutes a week
                          </div>
                      </div>
                  </div>
              </div>
              </div>

</div>
      )
  }
}

export class PasswordResetPage extends React.Component {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {

        }

  }




  render() {
      return(
          <div>
    <Menubar />
          <div className="ui text container">
              <div className="fullPageDiv">
                  <div className="spacer">&nbsp;</div>
                  <div className="ui alert"></div>
                  <div className="ui two column stackable grid">
                      <PasswordResetForm />
                      <div className="ui eight wide column">
                          <div className="massiveType">
                              10 minutes a day is better than 90 minutes a week
                          </div>
                      </div>
                  </div>
              </div>
              </div>

</div>
      )
  }
}

export class JoinPage extends React.Component {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {
            alert: ""

        }

  }

  componentDidMount = () => {
      $(this.refs['ref_joinForm']).hide()

};


    handleEmailSent = () => {
        this.setState({
           alert: "You've made a great first step. We've sent you an email. Please confirm your address to continue."
        }, () => {$(this.refs['ref_joinForm']).slideDown()})
    };

  render() {


      return(
          <div>
    <Menubar />
          <div className="ui text container">
              <div className="fullPageDiv">
                  <div className="spacer">&nbsp;</div>
                  <div className="spacer">&nbsp;</div>

                  <div ref="ref_joinForm" className="ui spacer purple-inverted">{this.state.alert}</div>
                  <div className="ui two column stackable grid">
                      <JoinForm emailSent={this.handleEmailSent} />
                      <div className="ui eight wide column">
                          <div className="massiveType">
                              10 minutes a day is better than 90 minutes a week

                          </div>
                      </div>
                  </div>
              </div>
              </div>L

</div>
      )
  }
}

export class PasswordConfirmPage extends React.Component {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {

        }

  }


handleError = (theError) => {
        this.setState({
            error:theError,
        })

    };

  render() {
      return(
          <div>
    <Menubar />
          <div className="ui text container">
              <div className="fullPageDiv">
                  <div className="spacer">&nbsp;</div>
                  <div className="ui two column stackable grid">
                      <PasswordConfirmForm params={this.props.params} theError={this.handleError} />
                      <div className="ui eight wide column">
                          <div className="massiveType">
                              10 minutes a day is better than 90 minutes a week
                          </div>
                      </div>
                  </div>
              </div>
              </div>

</div>
      )
  }
}

export class ErrorReporter extends React.Component {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {
            error: "",

        }

  }

  componentDidMount() {
      this.state.error = this.props.error
  }

  componentWillReceiveProps(nextProps) {
      if (this.state.error != nextProps.error) {
          this.state.error = nextProps.error;
                //printObject(this.state.error)

      }
  }

  render() {
      if (this.state.error) {
          return (
              <div>
              <div className="ui negative message">{this.state.error.err}</div>
                  <div className="ui row"> &nbsp;</div>
              </div>
          )
      }
      else {
          return (
              <div>
                  <div className="ui row"> &nbsp;</div>
              </div>
          )
      }


  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            username: "",
            password: "",
            email: "",
            serverErrors: []


        }
    }

  componentWillReceiveProps (nextProps) {
      if (this.props.location != nextProps.location) {
          store.dispatch(push(nextProps.location.state.nextPathname));
          //browserHistory.push(nextProps.location.state.nextPathname)
      }
  }

  actionAfterLogin = () => {

      var theUrl = '/api/users/i/';
        $.ajax({
            method: 'GET',
            url: '/api/users/i/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                if (res.id != null) {
                    store.dispatch(setCurrentUser(res))
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        });


      if (this.props.location) {
          store.dispatch(push(nextProps.location.state.nextPathname));
          //browserHistory.push(nextProps.location.state.nextPathname)
      } else {
          store.dispatch(push('/'))
      }
  };

  handleForgotPasswordClick() {
      store.dispatch(push('/account/password/reset/'))
  }

  handleJoinClick() {
      store.dispatch(push('/joinKiterope/'));
      //browserHistory.push("/joinKiterope/")
  }

  handleSubmit = (e) => {


      e.preventDefault();
      var username = this.state.email;
      var pass = this.state.password;

      auth.login(username, pass, (loggedIn) => {
        if (loggedIn) {
            this.actionAfterLogin()
        } else {
            var theErrors = this.state.serverErrors;
            theErrors.push("That email/password combination is not that of a current user.");
            this.setState({serverErrors:theErrors})


        }

      })


  };

  handleEmailChange = (value) => {
      this.setState({
          email:value,
          username:value,
      })

  };

  handlePasswordChange = (value) => {
      this.setState({
          password:value,
      })

  };

  getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

  render() {
      return (
          <div className="ui eight wide segment column">
                          <div className="ui row">
                              <div className="header"><h1>Sign In</h1></div>
                              <div className="ui row">&nbsp;</div>

                              <form className="ui form" method="POST"  encType="multipart/form-data" onSubmit={this.handleSubmit}>


                                      <ValidatedInput
                                                    type="text"
                                                    name="email"
                                                    label="Email"
                                                    id="id_email"
                                                    placeholder=""
                                                    value={this.state.email}
                                                    initialValue={this.state.email}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleEmailChange}
                                            />

                                       <ValidatedInput
                                                    type="password"
                                                    name="password"
                                                    label="Password"
                                                    id="id_password"
                                                    placeholder=""
                                                    value={this.state.password}
                                                    initialValue={this.state.password}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handlePasswordChange}
                                                    serverErrors={this.state.serverErrors}

                                            />






                                  <div className="ui row">
                                      <div className="float-right"><a style={{cursor:'pointer'}} onClick={this.handleForgotPasswordClick}>Forgot Password?</a>
                                      </div>
                                  </div>
                                  <button className="ui fluid purple button" type="submit">Sign In</button>
                              </form>
                              <hr />
                                  <div className="ui row">&nbsp;</div>
                                  <div className="ui row">&nbsp;</div>
                                  <div className="row">
                                      <div >Don't have an account?</div>
                                      <a onClick={this.handleJoinClick} className="ui large fluid button">Join Kiterope</a>
                                      </div>
                                  </div></div>

      )
  }

}


export class PasswordConfirmForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            password1: "",
            password2: "",
            uid:"",
            token:""

        }

    }

    componentDidMount() {
        this.setState({
            uid:this.props.params.uid,
            token:this.props.params.token,
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var uid = this.state.uid;
        var token = this.state.token;
        var password1 = this.state.password1;
        var password2 = this.state.password2;


        $.ajax({
            url: ("rest-auth/password/reset/confirm/"),
            dataType: 'json',
            type: 'POST',
            data: {
                new_password1: password1,
                new_password2:password2,
                uid:uid,
                token:token,
            },
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                this.props.theError({err})
            }.bind(this),

            complete: function (jqXHR, textStatus){
                if (textStatus == "success"){

                    store.dispatch(push("/account/login"))
                }
            }.bind(this)
        });
    };



    handlePassword1Change (value) {
      this.setState({
          password1:value,
      })

  }

  handlePassword2Change (value) {
      this.setState({
          password2:value,
      })

  }

    render() {
        return (
            <div className="ui eight wide segment column">
                <div className="ui row">
                    <div className="header"><h1>Change Password</h1></div>
                    <div className="ui row">&nbsp;</div>

                    <form className="ui form" method="POST" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                        <ValidatedInput
                                                    type="password"
                                                    name="password1"
                                                    label="Password"
                                                    id="id_password1"
                                                    placeholder=""
                                                    value={this.state.password1}
                                                    initialValue={this.state.password1}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handlePassword1Change}
                                            />
                                  <ValidatedInput
                                                    type="password"
                                                    name="password2"
                                                    label="Password (again)"
                                                    id="id_password2"
                                                    placeholder=""
                                                    value={this.state.password2}
                                                    initialValue={this.state.password2}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handlePassword2Change}
                                            />


                        <div className="ui row">&nbsp;</div>
                        <button className="ui fluid purple button" type="submit">Change Password</button>
                    </form>
                </div>
            </div>

        )
    }
}


export class PasswordResetForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            email: "",

        }

    }

    handleSubmit = (e) => {
        e.preventDefault();
        var email = this.state.email;

        $.ajax({
            url: ("rest-auth/password/reset/"),
            dataType: 'json',
            type: 'POST',
            data: {
                email: email,
            },
            success: console.log("this has been created"),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this),
            complete: function (jqXHR, textStatus){
                if (textStatus == "success"){
                    this.handleCompleted()
                }
            }.bind(this)
        });
    };

    handleCompleted() {
        store.dispatch(push("/account/login/"))
    }

    handleEmailChange = (value) => {
        this.setState({
            email: value,
        })

    };

    render() {
        return (
            <div className="ui eight wide segment column">
                <div className="ui row">
                    <div className="header"><h1>Reset Password</h1></div>
                    <div className="ui row">&nbsp;</div>
                    <div>Enter your e-mail address to reset your password.</div>

                    <form className="ui form" method="POST" encType="multipart/form-data" onSubmit={this.handleSubmit}>
                        <ValidatedInput
                            type="text"
                            name="email"
                            label="Email"
                            id="id_email"
                            placeholder=""
                            value={this.state.email}
                            initialValue={this.state.email}
                            validators='"!isEmpty(str)"'
                            onChange={this.validate}
                            stateCallback={this.handleEmailChange}
                        />


                        <div className="ui row">&nbsp;</div>
                        <button className="ui fluid purple button" type="submit">Reset Password</button>
                    </form>
<div class="ui row">&nbsp;</div>
                    <div>Please <a href="mailto:support@kiterope.com">contact us</a> if you have any trouble resetting your password.</div>
                </div>
            </div>

        )
    }
}

export class JoinForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            username: "",
            email: "",
            password1: "",
            password2: "",
            last_name: "",
            first_name: "",
            tos: false,
            emailSent: true,
            serverErrors: "",
            tosErrors: [],
            buttonLabel:"Join Kiterope"


        }
    }


  componentWillReceiveProps (nextProps) {
      if (this.props.location != nextProps.location) {
          store.dispatch(push(nextProps.location.state.nextPathname) )
      }
  }


  handleSubmit = (e) => {
      e.preventDefault();
      this.setState({
          buttonLabel:"Joining..."
      });

      if (this.state.tos == true) {
          var username = this.state.username;
          var email = this.state.email;
          var password1 = this.state.password1;
          var password2 = this.state.password2;
          var first_name = this.state.first_name;
          var last_name = this.state.last_name;


          var theUrl = "rest-auth/registration/";
          $.ajax({
              url: theUrl,
              dataType: 'json',

              type: 'POST',
              data: {
                  username: username,
                  email: email,
                  password1: password1,
                  password2: password2,
                  first_name: first_name,
                  last_name: last_name,

              },
              success: function (data) {
                  this.handleSuccess()
              }.bind(this),
              error: function (xhr, status, err) {

                  console.error(theUrl, status, err.toString());
                  var serverErrors = xhr.responseJSON;
                  this.setState({
                      serverErrors: serverErrors,
                      buttonLabel:"Join Kiterope"
                  })
              }.bind(this)
          });
      } else {
          var theServerErrors = this.state.tosErrors;
              theServerErrors.push( "You must agree to the Terms of Service to join." );

          this.setState({
              tosErrors: theServerErrors,
              buttonLabel:"Join Kiterope"


          })
      }
  };

  handleSuccess = () => {
      this.setState({
          username:"",
          email:"",
          password1:"",
          password2:"",
          first_name:"",
          last_name:"",
          serverErrors:"",
          buttonLabel:"Joined"
      });
      this.props.emailSent()
  };

  handleUsernameChange = (value) => {
      this.setState({
          username:value,
      })

  };
  handleEmailChange = (value) => {
      this.setState({
          email:value,
          username:value
      })

  };
  handleFirstNameChange = (value) => {
      this.setState({
          first_name:value,
      })

  };

  handleLastNameChange = (value) => {
      this.setState({
          last_name:value,
      })

  };

  handlePassword1Change = (value) => {
      this.setState({
          password1:value,
          password2:value,
      })

  };

  handlePassword2Change = (value) => {
      this.setState({
          password2:value,
      })

  };
  handleTOSChange = (value) => {
      this.setState({
          tos:value
      })
  };

  handleSignInClick = () => {
      store.dispatch(push("/account/login/"))
  };

  getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

  render() {

      return (
          <div className="ui eight wide segment column">
                          <div className="ui row">
                              <div className="header"><h1>Join Kiterope</h1></div>
                              </div>
                            <div className="ui row">&nbsp;</div>

                                  <form className="ui form" method="POST" encType="multipart/form-data"
                                        onSubmit={this.handleSubmit}>

                                <div className=" ui two column  vertically padded grid  ">
                                    <div className="ui row">
                                    <div className="ui column">
                                <ValidatedInput
                                          type="text"
                                          name="first_name"
                                          label="First Name"
                                          id="id_firstName"
                                          placeholder=""
                                          value={this.state.first_name}
                                          initialValue={this.state.first_name}
                                          validators='"!isEmpty(str)"'
                                          onChange={this.validate}
                                          stateCallback={this.handleFirstNameChange}
                                          serverErrors={this.getServerErrors("first_name")}

                                      />
                                        </div>

                                    <div className="ui column">

                                      <ValidatedInput
                                          type="text"
                                          name="last_name"
                                          label="Last Name"
                                          id="id_lastName"
                                          placeholder=""
                                          value={this.state.last_name}
                                          initialValue={this.state.last_name}
                                          validators='"!isEmpty(str)"'
                                          onChange={this.validate}
                                          stateCallback={this.handleLastNameChange}
                                          serverErrors={this.getServerErrors("last_name")}

                                      />
                                        </div>
                                        </div>
                                    </div>

                                      <ValidatedInput
                                          type="text"
                                          name="email"
                                          label="Email"
                                          id="id_email"
                                          placeholder=""
                                          value={this.state.email}
                                          initialValue={this.state.email}
                                          validators='"isEmail(str, { allow_display_name: false, require_display_name: false, allow_utf8_local_part: true, require_tld: false })"'
                                          onChange={this.validate}
                                          stateCallback={this.handleEmailChange}
                                          serverErrors={this.getServerErrors("email")}

                                      />
                                      <ValidatedInput
                                          type="password"
                                          name="password1"
                                          label="Password"
                                          id="id_password1"
                                          placeholder=""
                                          value={this.state.password1}
                                          initialValue={this.state.password1}
                                          validators='"!isEmpty(str)"'
                                          onChange={this.validate}
                                          stateCallback={this.handlePassword1Change}
                                          serverErrors={this.getServerErrors("password1")}

                                      />
                                      <div className="ui row">&nbsp;</div>
                                      <KRCheckBox
                                          value={this.state.tos}
                                          stateCallback={this.handleTOSChange}
                                          serverErrors={this.state.tosErrors}
                                          />


                                      <button className="ui fluid purple button" type="submit">{this.state.buttonLabel}</button>
                                  </form>

                              <hr />
                                  <div className="ui row">&nbsp;</div>
                                  <div className="ui row">&nbsp;</div>
                                  <div className="row">
                                      <div >Already have an account?</div>
                                      <div onClick={this.handleSignInClick} className="ui large fluid button">Sign In</div>
                                      </div>
                                  </div>

      )
  }

}

export class ModalPasswordResetForm extends PasswordResetForm {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {
            email: "",

        }

  }

  handleCompleted() {
      this.props.selectedForm({
          form:"SignIn"
      })

  }
}
export class ModalJoinForm extends JoinForm {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {
            username: "",
            email:"",
            password1: "",
            password2: "",
            first_name:"",
            last_name:"",

        }
  }


  handleSignInClick() {
      this.props.selectedForm({
          form:"SignIn"
      })
  }

}

@connect(mapStateToProps, mapDispatchToProps)
export class ModalLoginForm extends React.Component {
    constructor(props) {
      super(props);
      autobind(this);
        this.state = {
            username: "",
            email:"",
            password: "",
            serverErrors:""
        }
  }

    handleForgotPasswordClick() {
      this.props.selectedForm({
          form:"ForgotPassword"
      })
  }

  handleJoinClick() {
      this.props.selectedForm({
          form:"Join"
      })
  }

  componentWillReceiveProps (nextProps) {
      if (this.props.location != nextProps.location) {
          store.dispatch(push(nextProps.location.state.nextPathname) )
      }
  }

  handleSubmit = (e) => {
      console.log("handleSubmit");
      e.preventDefault();
      var username = this.state.email;
      var pass = this.state.password;

      auth.login(username, pass, (loggedIn) => {
        if (loggedIn) {
            this.actionAfterLogin()
        } else {
            console.log("in here")
        }


      });

      {/*      if(!auth.loggedIn()) {
          this.setState({
              serverErrors: {
                  email: [" "],
              password1:["This email/password combination does not match any registered user."]


          }})
      }*/}



  };

  handleEmailChange = (value) => {
      this.setState({
          email:value,
          username:value,
          serverErrors:""
      })

  };

  handlePasswordChange = (value) => {
      this.setState({
          password:value,
                    serverErrors:""

      })

  };

  actionAfterLogin = () => {
      var theUrl = '/api/users/i/';
      $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                //console.log("this.props.setCurrentUser")
                //this.props.setCurrentUser(res)
                if (res.id !=null ) {
                store.dispatch(setCurrentUser(res))

            }}.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        });

      var user = this.state.user;
      this.props.selectedForm({
          form:"None",
          user:user
      })
  };

  render() {
      return (
          <div className="ui eight wide segment column">
                          <div className="ui row">
                              <div className="header"><h1>Sign In</h1></div>
                              <div className="ui row">&nbsp;</div>

                              <form className="ui form" method="POST"  encType="multipart/form-data" onSubmit={this.handleSubmit}>


                                      <ValidatedInput
                                                    type="text"
                                                    name="email"
                                                    label="Email"
                                                    id="id_email"
                                                    placeholder=""
                                                    value={this.state.email}
                                                    initialValue={this.state.email}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleEmailChange}
                                                    serverErrors={this.state.serverErrors.email}
                                            />

                                       <ValidatedInput
                                                    type="password"
                                                    name="password"
                                                    label="Password"
                                                    id="id_password"
                                                    placeholder=""
                                                    value={this.state.password}
                                                    initialValue={this.state.password}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handlePasswordChange}
                                                    serverErrors={this.state.serverErrors.password1}
                                            />






                                  <div className="ui row">
                                      <div className="float-right"><a style={{cursor:'pointer'}} onClick={this.handleForgotPasswordClick}>Forgot Password?</a>
                                      </div>
                                  </div>
                                  <button className="ui fluid purple button" type="submit">Sign In</button>
                              </form>
                              <hr />
                                  <div className="ui row">&nbsp;</div>
                                  <div className="ui row">&nbsp;</div>
                                  <div className="row">
                                      <div >Don't have an account?</div>
                                      <a onClick={this.handleJoinClick} className="ui large fluid button">Join Kiterope</a>
                                      </div>
                                  </div></div>

      )
  }



}







module.exports = { NotificationManager, Footer, ErrorReporter, LoginPage, Menubar, JoinPage, PasswordResetPage , PasswordConfirmPage, PasswordConfirmForm, SignInOrSignUpModalForm, StandardSetOfComponents};