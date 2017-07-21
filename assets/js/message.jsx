var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import autobind from 'class-autobind'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCE from 'react-tinymce';
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import ScrollArea from 'react-scrollbar'
import Rnd from 'react-rnd';
var Modal = require('react-modal');
var Datetime = require('react-datetime');
import Dropzone from 'react-dropzone';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import BigCalendar from 'react-big-calendar';
var classNames = require('classnames');
import validator from 'validator';
require('react-datepicker/dist/react-datepicker.css');
import 'react-select/dist/react-select.css';
//var MaskedInput = require('react-maskedinput');

import { addThread, addOpenThread, closeOpenThread, addMessage, setMessageWindowVisibility, setCurrentUser, setCurrentContact, reduxLogout, showSidebar, setCurrentThread, setOpenThreads, showMessageWindow } from './redux/actions'
import { Provider, connect, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'
import  {store} from "./redux/store";

import {ImageUploader, PlanForm2, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList , SimpleStepForm} from './step';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable, StepCalendarComponent, StepEditCalendarComponent } from './calendar'
import { UpdatesList } from './update'
var ReconnectingWebSocket = require('reconnecting-websocket');
import Websocket from 'react-websocket';

var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
//var ws_scheme =  "ws";
import PropTypes from 'prop-types';
import {enableUniqueIds, nextUniqueId} from 'react-html-id'



import { theServer, s3IconUrl, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from './constants'

const websocketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1500,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 1000,
    maxRetries: 3,
    debug: true,
};


//var chat_socket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat-messages" + "/theLabel3");

//chat_socket.onmessage = (message) => {
//    var data = JSON.parse(message.data);
//    alert(data)
//};

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

const style = {
  border: 'solid 1px gray',
    borderTop:'none',
    borderBottom: '1px double gray',
  borderRadius: '4px 4px 0px 0px',
  color: '#000',
    backgroundColor:'white',
  display: 'block',
  justifyContent: 'left',
};

const verticalScrollbarStyle = {
    color: '#2185D0',
    borderRadius:'2px, 2px, 2px, 2px',

};

@connect(mapStateToProps, mapDispatchToProps)
export class MessageWindowContainer extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            threads:{},
            openThreads:{},
            currentThread:{},
            selectedLabelId:"",
            currentMessageThreadChannel:"",
            user:"",
            currentThreadContact:"",
            notificationWebsocket:""

        }

    }

    componentDidMount () {

        if (this.props.storeRoot) {
            this.setState({
                user: this.props.storeRoot.user,
                threads: this.props.storeRoot.messageThreads,
                currentThread: this.props.storeRoot.gui.currentThread,
                openThreads: this.props.storeRoot.gui.openThreads
            })
        }
    }

    componentWillReceiveProps(nextProps) {
                if (nextProps.storeRoot) {
                    if (this.state.user != nextProps.storeRoot.user) {
                        this.setState({
                            user: nextProps.storeRoot.user
                        }, this.connectToNotificationChannel());
                            //if (nextProps.storeRoot.user.notificationChannelLabel != undefined) {
                                //this.connectToNotificationChannel(nextProps.storeRoot.user.notificationChannelLabel)

                            //}
                    }

                    if (this.state.threads != nextProps.storeRoot.messageThreads) {
                        this.setState({
                            threads: nextProps.storeRoot.messageThreads
                        })
                    }

                    if (this.state.currentThread != nextProps.storeRoot.gui.currentThread) {
                        this.setState({
                            currentThread: nextProps.storeRoot.gui.currentThread
                        })
                    }

                    if (this.state.openThreads != nextProps.storeRoot.gui.openThreads) {
                        this.setState({
                            openThreads: nextProps.storeRoot.gui.openThreads
                        })
                    }
                }
    }

    connectToNotificationChannel = () => {
        if (this.state.user) {
            var notificationWebsocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/notifications/" + this.state.user.notificationChannelLabel + "/?token=" + localStorage.token);
            notificationWebsocket.onmessage = (message) => {
                var messageData = JSON.parse(message.data);
                if (messageData.text == "openPrivateTextChannel") {
                    this.connectToThread(messageData.privateChannelId)

                }
            };

            this.setState({
                notificationWebsocket: notificationWebsocket
            })
        }
    };




/*
    removeThread = (id) => {
        /*var array = this.state.openThreads.filter(function(item) {
            return item.id !== e
        })
        this.setState({
            openThreads: array
        }, this.updateCurrentThread)


        store.dispatch(closeOpenThread(id))
        this.updateCurrentThread
                        //store.dispatch(setOpenThreads(array))

    }

    updateCurrentThread = () => {
        if (this.state.openThreads.length != 0) {
            var last = this.state.openThreads[this.state.openThreads.length - 1]
            this.setState({currentThread: last})
                                    store.dispatch(setCurrentThread(last))

        }
        else {
            this.setState({currentThread:""})
                                                store.dispatch(setCurrentThread(""))


        }

    }

    handleCurrentThreadChosen = (messageThread) => {
        if (messageThread.threadId) {
            this.setState({currentThread: messageThread.threadId})
            store.dispatch(setCurrentThread(messageThread.threadId))

        } else {
            this.setState({currentThread:""})
                                                            store.dispatch(setCurrentThread(""))

        }
    }
    */

    connectToThread = (channelId) => {
        var theUrl = "api/channels/" + channelId + "/messageThread";
            $.ajax({
                method: 'GET',
                url: theUrl,
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (messageThreadData) {
                    if (messageThreadData.results[0]) {
                        var theMessageThreadData = messageThreadData.results[0];
                        theMessageThreadData.websocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat-messages/" + theMessageThreadData.channelLabel + "/?token=" + localStorage.token);
                        store.dispatch(addThread(theMessageThreadData));
                        store.dispatch(setCurrentThread(theMessageThreadData));

                        this.setState({
                            //openThreads: this.state.openThreads.concat(theMessageThreadData),
                            currentThread: theMessageThreadData,
                            currentReceiverNotificationChannelLabel: "",
                            currentMessageThreadChannel: "",
                            currentReceiver: "",
                        })






                    } else {
                        this.createNewMessageThread()

                    }


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            })


    };










//            chat_socket.send(JSON.stringify(message));


    createNewMessageThread(){
    $.ajax({
        url: "api/messageThreads/",
        dataType: 'json',
        headers: {
            'Authorization': 'Token ' + localStorage.token
        },

        type: 'POST',
        data: {
            receiver: this.state.currentThreadContact.id,
            sender: this.state.user.id,
            channel: this.state.currentMessageThreadChannel.id

        },

        success: function (messageThreadData) {
            messageThreadData.websocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat-messages/" + messageThreadData.channelLabel + "/?token=" + localStorage.token);
            store.dispatch(addThread(messageThreadData));
            store.dispatch(setCurrentThread(messageThreadData));

            this.setState({
                //openThreads: this.state.openThreads.concat({messageThreadData}),
                currentThread: messageThreadData,
                currentReceiverNotificationChannelLabel: "",
                currentMessageThreadChannel: "",
                currentReceiver: "",
            });
                                                            //store.dispatch(setOpenThreads(this.state.openThreads))

        }.bind(this),
        error: function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });

}


    connectToWebsocket = (websocketType, websocketLabel) => {
        var theSocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/" + websocketType + "/" + websocketLabel + "/?token=" + localStorage.token);
        theSocket.onmessage = (message) => {
            var data = JSON.parse(message.data);
        };

    };

    /*
    handleThreadCloseClick = (messageThread) => {
        this.removeThread(messageThread.threadId)


    }*/
    getReceiverNotificationChannelLabel = (receiverId) => {
        if (this.state.contacts) {
            this.setState({currentReceiverNotificationChannelLabel: this.state.contacts[receiverId].notificationChannelLabel})
        }

        /*var theUrl = 'api/users/' + receiverId
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(user) {
                this.setState({
                    currentReceiverNotificationChannelLabel: user.notificationChannelLabel,
                })
                //this.connectToWebsocket("notifications", user.notificationChannelLabel)


            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
                return null
            }
        })*/


    };

    getOrCreateThreadChannel = (receiverId) => {
        console.log("inside get or create");
        var theUrl = 'api/channelUsers/' + receiverId;
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {
                var theMessageThreadChannelLabel = data[0].label;
                this.setState({ currentMessageThreadChannel: {
                    label: data[0].label,
                    id: data[0].id,
                    type: "chat-messages",

                },

                },
                );
                //console.log("theMessageThreadChannelLabel " + theMessageThreadChannelLabel)

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
                return null
            }
        })

    };




    handleLabelClick = (selectedLabelId) => {
        this.setState({selectedLabelId:selectedLabelId})
    };


    handleNewThread = (contact) => {

        // Get the channel where the receiver gets their messages
        this.getReceiverNotificationChannelLabel(contact.id);

        // Get the channel where the receiver and sender can communicate privately
        this.getOrCreateThreadChannel(contact.id);

        var threadConnectionIntervalId = setInterval(this.createAndOrConnectToThread, 2000);
        this.setState({
            currentThreadContact: contact,
            threadConnectionIntervalId:threadConnectionIntervalId
        }
        )



    };

      handleMessageThreadClick = (messageThread) => {


          this.getReceiverNotificationChannelLabel(messageThread.receiver);
          this.getOrCreateThreadChannel(messageThread.receiver);

          var threadConnectionIntervalId = setInterval(this.createAndOrConnectToThread, 2000);
        this.setState({
            currentThreadContact: messageThread,
            threadConnectionIntervalId:threadConnectionIntervalId
        }
        )


      };


    render() {
        return (
            <div>
                <MessageWindow user={this.state.user} currentThreadChosen={this.handleCurrentThreadChosen}
                               newThread={this.handleNewThread} threadCloseClick={this.handleThreadCloseClick}
                               openThreads={this.state.openThreads} threads={this.state.threads}
                               currentThread={this.state.currentThread} />


            </div>
        )

    }

}

export class MessagePage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            threads:[],
            openThreads:[],
            currentThread:"",
            selectedLabelId:"",
            currentMessageThreadChannel:"",
            user:"",
            currentThreadContact:"",
            notificationWebsocket:""

        }
    }

    connectToNotificationChannel = (notificationChannelLabel) => {

        var notificationWebsocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/notifications/" + notificationChannelLabel + "/?token=" + localStorage.token);
        notificationWebsocket.onmessage = (message) => {
            var messageData = JSON.parse(message.data);
            if (messageData.text == "openPrivateTextChannel") {
                this.connectToThread(messageData.privateChannelId)

            }
        };

        this.setState({
            notificationWebsocket:notificationWebsocket
        })
    };

    checkIfUser = () => {
        if (this.props.storeRoot) {
        if (this.props.storeRoot.user) {
            this.setState({
                user: this.props.storeRoot.user
            });
            this.connectToNotificationChannel(userData.notificationChannelLabel)


        }
    }


    };



    removeThread = (e) =>{
        var array = this.state.openThreads.filter(function(item) {
            return item.id !== e
        });
        this.state.messageThreads[e].websocket.close(code = 1000, reason = '', {keepClosed: true, });
        this.state.messageThreads[e].websocket = undefined;


        this.setState({
            openThreads: array
        }, this.updateCurrentThread)
    };

    updateCurrentThread = () => {
        if (this.state.openThreads.length != 0) {
            var last = this.state.openThreads[this.state.openThreads.length - 1];
            this.setState({currentThread: last})
        }
        else {
            this.setState({currentThread:""})
        }

    };

    handleCurrentThreadChosen = (messageThread) => {
        if (messageThread.threadId) {
            this.setState({currentThread: messageThread.threadId})
        } else {
            this.setState({currentThread:""})
        }
    };

    connectToThread = (channelId) => {
        var theUrl = "api/channels/" + channelId + "/messageThread";
            $.ajax({
                method: 'GET',
                url: theUrl,
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (messageThreadData) {
                    if (messageThreadData.results[0]) {
                        var theMessageThreadData = messageThreadData.results[0];
                        theMessageThreadData.websocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat-messages/" + theMessageThreadData.channelLabel + "/?token=" + localStorage.token);


                        this.setState({
                            openThreads: this.state.openThreads.concat(theMessageThreadData),
                            currentThread: theMessageThreadData,
                            currentReceiverNotificationChannelLabel: "",
                            currentMessageThreadChannel: "",
                            currentReceiver: "",
                        })



                    } else {
                        this.createNewMessageThread()

                    }


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            })


    };




    sendNotificationToWakeupPrivateChannel = (receiverNotificationChannelLabel, privateChannel) => {
        var receiverNotificationWebsocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/notifications/" + receiverNotificationChannelLabel + "/?token=" + localStorage.token);
        var notificationPrivateChannelWakeupMessage = {
            text: "openPrivateTextChannel",
            privateChannel: privateChannel.label,
            privateChannelId: privateChannel.id,
            typeOfMessage: "notifications",
            channel: receiverNotificationChannelLabel,
            token: localStorage.token,


        };

        receiverNotificationWebsocket.addEventListener('open', () => {
            receiverNotificationWebsocket.send(JSON.stringify(notificationPrivateChannelWakeupMessage));


        });


};





//            chat_socket.send(JSON.stringify(message));


    createNewMessageThread(){
        console.log("");
    $.ajax({
        url: "api/messageThreads/",
        dataType: 'json',
        headers: {
            'Authorization': 'Token ' + localStorage.token
        },

        type: 'POST',
        data: {
            receiver: this.state.currentThreadContact.id,
            sender: this.state.user.id,
            channel: this.state.currentMessageThreadChannel.id

        },

        success: function (messageThreadData) {
            messageThreadData.websocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat-messages/" + messageThreadData.channelLabel + "/?token=" + localStorage.token);


            this.setState({
                openThreads: this.state.openThreads.concat({messageThreadData}),
                currentThread: messageThreadData,
                currentReceiverNotificationChannelLabel: "",
                currentMessageThreadChannel: "",
                currentReceiver: "",
            })
        }.bind(this),
        error: function (xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });

}







    connectToWebsocket = (websocketType, websocketLabel) => {
        var theSocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/" + websocketType + "/" + websocketLabel + "/?token=" + localStorage.token);
        theSocket.onmessage = (message) => {
            var data = JSON.parse(message.data);
        };

    };

    handleThreadCloseClick = (messageThread) => {
        this.removeThread(messageThread.threadId)


    };
    getReceiverNotificationChannelLabel = (receiverId) => {

        var theUrl = 'api/users/' + receiverId;
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(user) {
                this.setState({
                    currentReceiverNotificationChannelLabel: user.notificationChannelLabel,
                });
                //this.connectToWebsocket("notifications", user.notificationChannelLabel)


            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
                return null
            }
        })


    };



    getOrCreateThreadChannel = (receiverId) => {
        var theUrl = 'api/channelUsers/' + receiverId;
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(data) {
                var theMessageThreadChannelLabel = data[0].label;
                this.setState({ currentMessageThreadChannel: {
                    label: data[0].label,
                    id: data[0].id,
                    type: "chat-messages",

                },

                },
                );
                //console.log("theMessageThreadChannelLabel " + theMessageThreadChannelLabel)

            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
                return null
            }
        })

    };
    componentDidMount () {

        this.checkIfUser()
    }



    handleLabelClick = (selectedLabelId) => {
        this.setState({selectedLabelId:selectedLabelId})
    };


    handleNewThread = (contact) => {

        // Get the channel where the receiver gets their messages
        this.getReceiverNotificationChannelLabel(contact.id);

        // Get the channel where the receiver and sender can communicate privately
        this.getOrCreateThreadChannel(contact.id);

        var threadConnectionIntervalId = setInterval(this.createAndOrConnectToThread, 2000);
        this.setState({
            currentThreadContact: contact,
            threadConnectionIntervalId:threadConnectionIntervalId
        }
        )



    };

      handleMessageThreadClick = (messageThread) => {


          this.getReceiverNotificationChannelLabel(messageThread.receiver);
          this.getOrCreateThreadChannel(messageThread.receiver);

          var threadConnectionIntervalId = setInterval(this.createAndOrConnectToThread, 2000);
        this.setState({
            currentThreadContact: messageThread,
            threadConnectionIntervalId:threadConnectionIntervalId
        }
        )


      };


    render() {
        return (
            <div>
                <MessageWindow user={this.state.user}
                               newThread={this.handleNewThread} threadCloseClick={this.handleThreadCloseClick}
                               openThreads={this.state.openThreads} threads={this.state.threads}
                               currentThread={this.state.currentThread}/>
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>

                <div className="fullPageDiv">
                    <div className="ui page container footerAtBottom">

                        <div className="spacer">&nbsp;</div>

                        <div className="ui large breadcrumb">
                            <Link to={`/#`}>
                                <div className="section">Home</div>
                            </Link>

                            <i className="right chevron icon divider"></i>
                            <Link to={`/#/messages`}>
                                <div className="active section">My Messages</div>
                            </Link>
                        </div>
                        <div>&nbsp;</div>
                        <Header headerLabel="My Messages"/>
                        <div className="ui grid">
                            <MessagePageLabelsList click={this.handleLabelClick}/>

                            <div className="eight wide column">

                                <MessageThreadList user={this.state.user}
                                                   messageThreadListItemClick={this.handleMessageThreadClick}
                                                   selectedLabelId={this.state.selectedLabelId}/>
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        )

    }
}

export class MessageThreadItemLabelsList extends React.Component {
    constructor(props) {

        super(props);
        autobind(this);
        this.state = {
            labelsList:[],
            openModal:false,
        }
    }

    componentDidMount() {
        this.setState({
            labelsList:this.props.labelsList
        })
    }

    handleNewLabelClick() {
        this.setState({openModal:true})
    }

    handleCloseClick = (closeLabelId) => {
        this.props.closeClick(closeLabelId)
    };

    handleClick = (callbackData) => {
         this.props.click(callbackData)
     };

    componentWillReceiveProps(nextProps) {
        if (this.state.labelsList != nextProps.labelsList)  {
            this.setState({
                labelsList: nextProps.labelsList,
            })
        }
    }

    render () {
        if (this.state.labelsList) {
            var labelsList = this.state.labelsList.map((label) => {


                return (
                    <MessageThreadItemLabel key={`messageThreadItemLabel_${label.text}`} click={this.handleClick}  closeClick={this.handleCloseClick}
                                            text={label.text} myId={label.id}/>
                )
            })
        }


        return (

                <div className="messageThreadItemLabelsListContainer">

                <div className="messageThreadItemLabelsList">



                    {labelsList}</div>
                    <MessageThreadLabelMenu newLabelClick={this.handleNewLabelClick} click={this.handleClick}/>
                    <NewLabelModal click={this.handleModalClick} modalIsOpen={this.state.openModal} header="Create a New Label" description="" buttons={[
                            {text:"Create Label", action:"create", color:"purple"},

                        ]} />
                </div>

        )
    }

}



export class MessageThreadLabelMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
                    data:[],

        }
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };

     handleNewLabelClick = () => {
         this.props.newLabelClick()
     };

     componentDidMount() {
         this.loadLabelsFromServer()
     }

     loadLabelsFromServer = () => {

    $.ajax({
      url: 'api/labels/message',
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('api/labels/message', status, err.toString());
      }.bind(this),

    })
     };



     render () {
         var myStyle = { display: "block"};
         if (this.state.data != null) {

             var labels = this.state.data.map((label) => {
                 return (
                         <ContextualMenuItem key={`key_labelMenuItem_${label.id}`} click={this.handleClick} text={label.text} myId={label.id} />
                 )
             })
         }


         return(
<div className="messageThreadItemAddLabel">
                  <div className="ui simple dropdown item " >
                      <div className="messageThreadItemAddLabel">+ Label</div>
                      <div className="menu contextualMenu">
                         <ContextualMenuItem click={this.handleNewLabelClick} text="New Label" myId="newLabel" />
                          {labels}

                      </div>
                  </div>
    </div>


         )
     }

}

export class MessageThreadItemLabel extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            selectedLabel:""
        }
    }

    handleCloseClick() {
        this.props.closeClick(this.props.myId)

    }


    render() {
        return (
            <div className="ui teal label messageThreadItemLabel"><div onClick={this.handleClick}>{this.props.text}<i onClick={this.handleCloseClick} className="messageThreadItemLabelClose close icon" ></i></div>
                           </div>

        )
    }

}


export class MessagePageLabelsList extends React.Component {
    constructor(props) {

        super(props);
        autobind(this);
        this.state = {
            data:[],
            selectedLabelId:""
        }
    }

    componentDidMount() {
        //var intervalID = setInterval(this.loadMessageLabelsFromServer, 2000)
        //this.setState({intervalID:intervalID})

    }

    componentWillUnmount () {
        clearInterval(this.state.intervalID)
    }

    handleClick = (selectedLabelId) => {
        this.setState({selectedLabelId:selectedLabelId});
        this.props.click(selectedLabelId)



    };


    loadMessageLabelsFromServer = () => {

    $.ajax({
      url: 'api/labels/message',
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('api/labels/message', status, err.toString());
      }.bind(this),

    });
  };

    render () {
var labelsList = this.state.data.map((label) => {


                return (
                    <MessageLabelMenuItem key={`messageLabelMenuItem_${label.id}`} selectedLabelId={this.state.selectedLabelId} click={this.handleClick} labelText={label.text} myId={label.id} />
                )
            });


        return (
            <div className="three wide column">

                <div>
                    <MessageLabelMenuItem key="messageLabelMenuItem_Unread" selectedLabelId={this.state.selectedLabelId} click={this.handleClick} labelText="Unread" myId="Unread" />
                    <MessageLabelMenuItem key="messageLabelMenuItem_All" selectedLabelId={this.state.selectedLabelId} click={this.handleClick} labelText="All" myId="All" />



                    {labelsList}
                    <MessageLabelMenuItem key="messageLabelMenuItem_Trash" selectedLabelId={this.state.selectedLabelId} click={this.handleClick} labelText="Trash" myId="Trash" />

                </div>

            </div>
        )
    }
}

export class MessageLabelMenuItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            isActive:"",
            selectedLabelId:""
        }
    }

    componentDidMount() {
        this.setState({
            selectedLabelId:this.props.selectedLabelId
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.selectedLabelId != nextProps.selectedLabelId) {
            this.setState({
                selectedLabelId:nextProps.selectedLabelId,
            });
            if (nextProps.selectedLabelId == this.props.myId ) {
                this.setState({
                    isActive:"activeItem"
                })
            } else {
                this.setState({
                    isActive:""

                })
            }

        }
    };
    handleClick = () => {
        this.props.click(this.props.myId)
    };

    render() {
        return (
            <div className={`fluid row messageLabelMenuItem ${this.state.isActive}`} onClick={this.handleClick}>{this.props.labelText}</div>

        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class MessageWindow extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            zIndex: 5,
            user:"",
            threads:[],
            openThreads:[],
            currentThread:"",
            x: window.innerWidth - 420,
            y: 70,
            width: 400,
            height: window.innerHeight - 180,
            currentReceiverNotificationChannelLabel:"",
            currentMesageThreadChannelLabel:"",
        };

    }

    componentDidMount () {
        setTimeout(() => this.setState({ zIndex: 1000 }), 5000);

        if (this.props.storeRoot) {
            this.setState({
                user: this.props.storeRoot.user,
                threads: this.props.storeRoot.messageThreads,
                currentThread: this.props.storeRoot.gui.currentThread,
                openThreads: this.props.storeRoot.gui.openThreads
            })
        }
    }

    componentWillReceiveProps(nextProps) {
                if (nextProps.storeRoot) {
                    if (this.state.user != nextProps.storeRoot.user) {
                        this.setState({
                            user: nextProps.storeRoot.user
                        })
                    }

                    if (this.state.threads != nextProps.storeRoot.messageThreads) {
                        this.setState({
                            threads: nextProps.storeRoot.messageThreads
                        })
                    }

                    if (this.state.currentThread != nextProps.storeRoot.gui.currentThread) {
                        this.setState({
                            currentThread: nextProps.storeRoot.gui.currentThread
                        })
                    }

                    if (this.state.openThreads != nextProps.storeRoot.gui.openThreads) {
                        this.setState({
                            openThreads: nextProps.storeRoot.gui.openThreads
                        })
                    }
                }
    }

    /*handleCurrentThreadChosen = (messageThread) => {

        this.props.currentThreadChosen({threadId: messageThread.threadId})
    }

    handleThreadCloseClick = (messageThread) => {

        this.props.threadCloseClick({threadId: messageThread.threadId})


}*/

    resizing(direction, styleSize, clientSize, delta, newPos) {

        this.setState({
            width:clientSize.width,
            height:clientSize.height,
            x: newPos.x,
            y: newPos.y
        })
    }

    moving(event, ui) {

        this.setState({
            x:ui.position.left ,
            y:ui.position.top
        })
    }

    onClick() {
    }

    onDoubleClick() {
        console.log("doubleClick called")
    }




/*

    handleNewThread(contact) {

        this.props.newThread(contact)
  }


*/


  handleMessageSubmit (theMessageData) {

      var channelMessage = {
          text: theMessageData.text,
          typeOfMessage: "chat-messages",
          channel: theMessageData.thread.channelLabel,
          sender: theMessageData.sender,


      };

    var theWebsocket = theMessageData.thread.websocket;
      theWebsocket.send(JSON.stringify(channelMessage));

      var theMessage =  {
          text: theMessageData.text,
          thread: theMessageData.thread.id,
          typeOfMessage: "chat-messages",
          sender:theMessageData.sender
      };

          var theUrl = "api/messages/";

      $.ajax({
        url: theUrl,
        dataType: 'json',
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },

        type: 'POST',
        data: theMessage,


        success: function(theSubmittedMessage) {
                             //store.dispatch(addMessage(this.state.currentThread.id, theSubmittedMessage))

        }.bind(this),
        error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
        }.bind(this)
        });





  }

  handleKRMessageSubmit (theMessageData) {
      var message = {
          text: theMessageData.text,
          channel: "chat-messages"
      };


    chat_socket.send(JSON.stringify(message));
    return false;
  }

  getUserId () {
      if (this.props.storeRoot.user != undefined) {
          return this.props.storeRoot.user.id
      } else {
          return ""
      }
  }

  handleMenuItemCloseClick() {
      store.dispatch(setMessageWindowVisibility(false))
  }



    render() {




    return (
        <div className="messageWindowPlayground">
            <Rnd
                ref={c => {
                    this.rnd = c;
                }}
                initial={{
                    x: this.state.x,
                    y: 70,
                    width: this.state.width,
                    height: this.state.height,
                }}
                dragHandlerClassName={'#messageWindowControlBar'}
                style={style}
                minWidth={300}
                minHeight={80}
                onResize={this.resizing}
                onDrag={this.moving}
                bounds={'parent'}
            ><span className="no-cursor"><div
                                              className="cursor ui fluid top attached right aligned blue button" >
                <div className="ui grid">
                    <div id="messageWindowControlBar" className="ui fourteen wide column">Messages</div>

                <div onClick={this.handleMenuItemCloseClick} className="ui right aligned column"><i  className="messageWindowCloseIcon large close icon" ></i></div>

                </div>
                </div>
               <MessageWindowMenuBar  />
        <WindowPane />
        </span>

            </Rnd>
            <MessageInput width={this.state.width} xPos={this.state.x} yPos={this.state.y + this.state.height}
                          onSubmit={this.handleMessageSubmit} thread={this.state.currentThread}
                          sender={this.getUserId()} />

        </div>

    );
  }

}


@connect(mapStateToProps, mapDispatchToProps)
export class WindowPane extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            tabs: [
                {label: "Contacts",}
            ],
            currentThread: null,
            openThreads:[],
            user:""

        }
    }

    componentDidMount () {

        if (this.props.storeRoot) {
            this.setState({
                user: this.props.storeRoot.user,
                threads: this.props.storeRoot.messageThreads,
                currentThread: this.props.storeRoot.gui.currentThread,
                openThreads: this.props.storeRoot.gui.openThreads
            })
        }
    }

    componentWillReceiveProps(nextProps) {
                if (nextProps.storeRoot) {
                    if (this.state.user != nextProps.storeRoot.user) {
                        this.setState({
                            user: nextProps.storeRoot.user
                        })
                    }

                    if (this.state.threads != nextProps.storeRoot.messageThreads) {
                        this.setState({
                            threads: nextProps.storeRoot.messageThreads
                        })
                    }

                    if (this.state.currentThread != nextProps.storeRoot.gui.currentThread) {
                        this.setState({
                            currentThread: nextProps.storeRoot.gui.currentThread
                        })
                    }

                    if (this.state.openThreads != nextProps.storeRoot.gui.openThreads) {
                        this.setState({
                            openThreads: nextProps.storeRoot.gui.openThreads
                        })
                    }
                }
    }

    /*handleNewThread = (contact) => {
        //this.setState({
          //  receiver: contact.id,
        //})
        //this.props.newThread({
          //  receiver: receiverInfo.receiverId,
            //sender:this.props.userId,
        //})

        this.props.newThread(contact)
        //this.sendOutNotificationToReceiverNotificationRoom(receiverInfo.receiverId)
    }*/





    render() {
         if (this.state.openThreads != undefined) {

             var theData = this.state.openThreads;
             var values = Object.keys(theData).map(function (key) {
                 return theData[key];
             });
             var theOpenThreadsPanes = values.map((openThread) => {

                 return (
                     <MessageThreadPane key={`key_messageThreadPane_${openThread.id}`}
                                        isVisible={true} thread={openThread}/>

                 )

             })
         }

        if (this.state.currentThread != undefined) {
             return (
<div className="windowPane">

                <ContactListPane isVisible={false} newThread={this.createNewMessageThread} />
    {theOpenThreadsPanes}
    {/*<MessageThreadPane  isVisible={true} currentThread={this.state.currentThread} />*/}
    </div>


)

        }
        else {
            return (

<div className="windowPane">
                <ContactListPane isVisible={true} newThread={this.handleNewThread} />
    {/*<MessageThreadPane key='key_messageThreadPane_contacts' user={this.state.user} isVisible={false} thread={this.state.currentThread} />*/}

</div>
            )

            }




    }
}



@connect(mapStateToProps, mapDispatchToProps)
export class MessageWindowMenuBarItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            otherParty:"",
            user:"",
            thread:""

        }
    }

    componentDidMount () {
        this.setState({thread: this.props.thread});

        if (this.props.storeRoot) {
            this.setState({
                user: this.props.storeRoot.user,
                threads: this.props.storeRoot.messageThreads,
                currentThread: this.props.storeRoot.gui.currentThread,
                openThreads: this.props.storeRoot.gui.openThreads
            }, this.updateOtherPartyInfo)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.thread != nextProps.thread) {
            this.setState({thread: nextProps.thread}, this.updateOtherPartyInfo)
        }
                if (nextProps.storeRoot) {
                    if (this.state.user != nextProps.storeRoot.user) {
                        this.setState({
                            user: nextProps.storeRoot.user
                        }, this.updateOtherPartyInfo)
                    }

                    if (this.state.threads != nextProps.storeRoot.messageThreads) {
                        this.setState({
                            threads: nextProps.storeRoot.messageThreads
                        })
                    }

                    if (this.state.currentThread != nextProps.storeRoot.gui.currentThread) {
                        this.setState({
                            currentThread: nextProps.storeRoot.gui.currentThread
                        })
                    }

                    if (this.state.currentContact != nextProps.storeRoot.gui.currentContact) {
                        this.setState({
                            currentContact: nextProps.storeRoot.gui.currentContact
                        })
                    }

                    if (this.state.openThreads != nextProps.storeRoot.gui.openThreads) {
                        this.setState({
                            openThreads: nextProps.storeRoot.gui.openThreads
                        })
                    }
                }
    }

    handleMenuItemCloseClick = () => {
        console.log("clsing thread " + this.state.thread.id);
                    store.dispatch(closeOpenThread(this.state.thread.id));

        this.updateCurrentThread()


    };

    updateCurrentThread = () => {
        console.log("update currentThread");
        if (this.state.openThreads.length > 0) {
            var last = this.state.openThreads[this.state.openThreads.length - 1];
            store.dispatch(setCurrentThread(last))
        }
        else {
            store.dispatch(setCurrentThread(null));

            //this.setState()
        }

    };



    handleMenuItemClick = () => {
        store.dispatch(setCurrentThread(this.props.thread))


    };

    updateOtherPartyInfo () {
        if (this.state.thread) {
            if (this.state.thread.sender == this.state.user.id) {
                var otherPartyName = this.state.thread.receiverName;
                var otherPartyPhoto = s3ImageUrl + this.state.thread.receiverPhoto
            } else {
                var otherPartyName = this.state.thread.senderName;
                var otherPartyPhoto = s3ImageUrl + this.state.thread.senderPhoto
            }
            this.setState({
                otherParty: {
                    name: otherPartyName,
                    image: otherPartyPhoto
                }
            })

        }
    }





    render() {
        if (this.state.otherParty == "") {
            //this.updateOtherPartyInfo()
        }
        if (this.props.label != "Contacts") {
            var theContactName = this.state.otherParty.name;
            var theCloseButton =  <div>
                            <i onClick={this.handleMenuItemCloseClick} className="messageWindowMenuBarItemIcon close icon" ></i>
                        </div>
        }
        else {
            var theContactName = this.props.label
        }
        return(
        <div>

                        <div className="item messageWindowMenubarItem"><div onClick={this.handleMenuItemClick}>{theContactName}</div>
                           {theCloseButton}</div>


                        </div>
        )

    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class MessageWindowMenuBarAdditionalItemsMenuItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],

        }
    }

    componentDidMount () {
        this.setState({thread: this.props.thread});

        if (this.props.storeRoot) {
            this.setState({
                user: this.props.storeRoot.user,
                threads: this.props.storeRoot.messageThreads,
                currentThread: this.props.storeRoot.gui.currentThread,
                openThreads: this.props.storeRoot.gui.openThreads
            }, this.updateOtherPartyInfo)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.thread != nextProps.thread) {
            this.setState({thread: nextProps.thread}, this.updateOtherPartyInfo)
        }
                if (nextProps.storeRoot) {
                    if (this.state.user != nextProps.storeRoot.user) {
                        this.setState({
                            user: nextProps.storeRoot.user
                        }, this.updateOtherPartyInfo)
                    }

                    if (this.state.threads != nextProps.storeRoot.messageThreads) {
                        this.setState({
                            threads: nextProps.storeRoot.messageThreads
                        })
                    }

                    if (this.state.currentThread != nextProps.storeRoot.gui.currentThread) {
                        this.setState({
                            currentThread: nextProps.storeRoot.gui.currentThread
                        })
                    }

                    if (this.state.currentContact != nextProps.storeRoot.gui.currentContact) {
                        this.setState({
                            currentContact: nextProps.storeRoot.gui.currentContact
                        })
                    }

                    if (this.state.openThreads != nextProps.storeRoot.gui.openThreads) {
                        this.setState({
                            openThreads: nextProps.storeRoot.gui.openThreads
                        })
                    }
                }
    }




    handleMenuItemClick = () => {
        store.dispatch(setCurrentThread(this.props.thread))


    };

    updateOtherPartyInfo () {
        if (this.state.thread) {
            if (this.state.thread.sender == this.state.user.id) {
                var otherPartyName = this.state.thread.receiverName;
                var otherPartyPhoto = s3ImageUrl + this.state.thread.receiverPhoto
            } else {
                var otherPartyName = this.state.thread.senderName;
                var otherPartyPhoto = s3ImageUrl + this.state.thread.senderPhoto
            }
            this.setState({
                otherParty: {
                    name: otherPartyName,
                    image: otherPartyPhoto
                }
            })

        }
    }

    render() {

        if (this.props.thread.sender == this.props.user.id) {
                 var otherPartyName = this.props.thread.receiverName;
                var otherPartyPhoto = this.props.thread.receiverPhoto
            } else {
                var otherPartyName = this.props.thread.senderName;
                var otherPartyPhoto = this.props.thread.senderPhoto
            }

        return(

                        <div className="item messageWindowMenubarItem" onClick={this.handleMenuItemClick}>{otherPartyName}</div>



        )

    }

}

@connect(mapStateToProps, mapDispatchToProps)
export class MessageWindowMenuBar extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            tabs: [
                {label: "Contacts",}
            ],
            openThreads: []

        }
    }

    componentDidMount () {
        if (this.props.storeRoot) {
            this.setState({
                user: this.props.storeRoot.user,
                threads: this.props.storeRoot.messageThreads,
                currentThread: this.props.storeRoot.gui.currentThread,
                openThreads: this.props.storeRoot.gui.openThreads
            })
        }
    }

    componentWillReceiveProps(nextProps) {
                if (nextProps.storeRoot) {
                    if (this.state.user != nextProps.storeRoot.user) {
                        this.setState({
                            user: nextProps.storeRoot.user
                        })
                    }

                    if (this.state.threads != nextProps.storeRoot.messageThreads) {
                        this.setState({
                            threads: nextProps.storeRoot.messageThreads
                        })
                    }

                    if (this.state.currentThread != nextProps.storeRoot.gui.currentThread) {
                        this.setState({
                            currentThread: nextProps.storeRoot.gui.currentThread
                        })
                    }

                    if (this.state.openThreads != nextProps.storeRoot.gui.openThreads) {
                        this.setState({
                            openThreads: nextProps.storeRoot.gui.openThreads
                        })
                    }
                }
    }











    render() {
        if (this.state.openThreads != undefined) {

            var theData = this.state.openThreads;
            var values = Object.keys(theData).map(function (key) {
                return theData[key];
            });

            var threadItems = values.map((thread) => {
                return (
                    <MessageWindowMenuBarItem key={`key_messageWindowMenuBarItem_${thread.id}`}
                                              thread={thread} /*currentThreadChosen={this.handleCurrentThreadChosen}
                                              threadCloseClick={this.handleThreadCloseClick} */ />
                )
            });


            var menuThreadItems = values.map((thread)  => {
                return (
                    <MessageWindowMenuBarAdditionalItemsMenuItem user={this.state.user}
                                                                 key={`key_messageWindowMenuBarItem_${thread.id}`}
                                                                 thread={thread}
                                                                 /* currentThreadChosen={this.handleCurrentThreadChosen}
                                                                 threadCloseClick={this.handleThreadCloseClick} *//>
                )
            })
        } else {
            var threadItems = () =>  { return (<div></div>)};
                        var menuThreadItems = () => { return (<div></div>)}

        }



        return (
                    <div className="ui absolutelyNoMargin noRadius mini menu ">
                        <div className="ui absolutelyNoMargin noRadius mini menu hidingOverflow noBorder noBoxShadow">


            <MessageWindowMenuBarItem key="contacts" label="Contacts" /* currentThreadChosen={this.handleCurrentThreadChosen} *//>
            {threadItems}</div>
            { threadItems.length ?
                    <div className="ui absolutelyNoMargin noRadius right mini menu noBoxShadow noBorder">
                        <MessageWindowThreadItemsMenu threadItems={menuThreadItems} click={this.handleThreadCloseClick}/>
                    </div>
                :
                    <div></div>}


        </div>
            )
    }

}

export class MessageWindowMenuBarAdditionalItems extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],

        }
    }

    handleClick() {

    }

    render () {
        return (

            <div className="item messageWindowMenuBarAdditionalItems" onClick={this.handleMenuItemClick}>>></div>

        )
    }


}


export class MessageWindowThreadItemsMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }



     render () {
         var myStyle = { display: "block"};
         return(

                  <div className="ui simple dropdown item messageWindowMenubarItem messageWindowMenuBarAdditionalItems" >
                      <div >
                      >></div>
                      <div className="menu">

                          {this.props.threadItems}
                      </div>
                  </div>


         )
     }

}
export class MessageWithRoundedEdges extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],

        }
    }

    render() {

        if (!this.props.style.sender) {
            return (
                <div className="messageContainer">

                    <div className={`rightMessage ${this.props.style.shape}`} >{this.props.messageText}</div>
                </div>

            )

        }
        else {
            return (
                <div className="messageContainer">

                <div className={`leftMessage ${this.props.style.shape}`} >{this.props.messageText}</div>

                </div>

            )

        }
    }
}


export class Message extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],

        }
    }

    render() {

        if (this.props.orientation == "left") {
            return (
                <div className="messageContainer">

                    <div className="rightMessage">{this.props.messageText}</div>
                </div>

            )

        }
        else {
            return (
                <div className="messageContainer">

                <div className="leftMessage">{this.props.messageText}</div>

                </div>

            )

        }
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            zIndex:1000,
            message: ""
        };


    }

    componentDidMount () {
                setTimeout(() => this.setState({ zIndex: 1000 }), 5000);

    }

    handleMessageChange = (e) => {
        this.setState({message:e.target.value})
    };

    sendMessage = () => {
        // I need to change this to a callback in MessageWindow
        this.setState({message:""});
        this.props.onSubmit({
            thread:this.props.thread,
            text:this.state.message,
            sender:this.props.sender,


        })


  };

    _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();


      this.sendMessage()
    }
  };

    render() {
        var style = {
            width: this.props.width + "px",
            top: this.props.yPos + "px",
            left: this.props.xPos + "px",
            zIndex:1000,
            borderTop:'1px #000 double',
            position: "relative"


        };
            if (this.props.thread) {

                return (
                    <div className="messageInput" style={style}>
                        <div className="ui grid">
                            <div className="one wide column">&nbsp;</div>
                            <div className="ten wide column">
                                <div className="fluid field">
                                    <textarea ref="ref_textarea" onKeyPress={this._handleKeyPress}
                                              value={this.state.message} style={{width: "100%"}} type="textarea"
                                              rows="3" onChange={this.handleMessageChange}/>
                                </div>
                            </div>
                            <div className="center aligned middle aligned four wide column ">

                                <div className="ui primary fluid button" onClick={this.sendMessage}>Send</div>
                                <div className="one wide column">&nbsp;</div>

                            </div>
                        </div>
                    </div>
                )
            }
            else {return(<div className="messageInput" style={style}></div>)}
    }
}


@connect(mapStateToProps, mapDispatchToProps)
export class MessageThreadList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            messages: [],
            user: "",
            selectedLabelId:"",
            activePage:1,

        }
    }
    handlePageChange = (pageNumber) => {
        this.setState({activePage: pageNumber}, () => this.loadMessageThreadsFromServer());

    };

    getPagination = () =>  {
          if (this.state.next != null || this.state.previous != null) {
              return (
                  <div className="ui center aligned one column grid">
                  <Pagination activePage={this.state.activePage}
                              itemsCountPerPage={9}
                              totalItemsCount={this.state.count}
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange}/>
                      </div>
              )
          } else {
          return ("")
          }
      };

    componentDidMount() {
        this.setupMessageLoading();
        this.setState({
            selectedLabelId:this.props.selectedLabelId,
            user:this.props.user
        })
    }


    componentWillReceiveProps = (nextProps) => {
        if (this.state.selectedLabelId != nextProps.selectedLabelId) {
            this.setState({
                selectedLabelId: nextProps.selectedLabelId
            })
        }

         if (this.state.user != nextProps.user) {
            this.setState({
                user: nextProps.user
            })
        }
    };

    setupMessageLoading = () => {
        var messageThreadListInterval = setInterval(this.loadMessageThreadsFromServer, 2000);
        this.setState({messageThreadListInterval:messageThreadListInterval})
    };

    loadMessageThreadsFromServer = () => {
            if (this.state.activePage != 1) {
                var includePage = "/?page=" + this.state.activePage
            } else {
                var includePage = "/"
            }

    if (this.state.selectedLabelId) {
        var theUrl = 'api/messageThreads/labels/' + this.state.selectedLabelId + includePage
    }
    else {
        var theUrl = 'api/messageThreads' + includePage
    }
    $.ajax({
      url: theUrl ,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            count: data.count,
            next:data.next,
            previous:data.previous,
            data: data.results,},
        clearInterval(this.state.messageThreadListInterval)
        );
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),

    });
  };
    handleMessageThreadListItemClick = (messageThread) => {
        this.props.messageThreadListItemClick(messageThread)

    };



    render () {
        var pagination = this.getPagination();

        if (this.state.data != null) {


        var messageThreadList = this.state.data.map((messageThread) => {
            if (messageThread.sender == this.state.user.id) {
                 var otherPartyName = messageThread.receiverName;
                var otherPartyPhoto = messageThread.receiverPhoto
            } else {
                var otherPartyName = messageThread.senderName;
                var otherPartyPhoto = messageThread.senderPhoto
            }




            return (
                    <MessageThreadListItem user={this.state.user} key={`messageThreadListItem_${messageThread.id}`} click={this.handleMessageThreadListItemClick} thread={messageThread}    />
)

        })
    } else {
            var messageThreadList = "You have no messages currently"
        }

    return (
        <div>
          <div className="messageThreadList">

              {messageThreadList}
      </div>
                            <div className="spacer">&nbsp;</div>

            {pagination}
            </div>
    );
  }

}

@connect(mapStateToProps, mapDispatchToProps)
export class MessageThreadListItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            thread:"",
            otherParty:"",
            user:""



        }
    }

    componentDidMount() {
        this.checkIfUser();
        this.setState({
            thread: this.props.thread,
            user: this.props.user
        })


    }
    componentWillReceiveProps = (nextProps ) => {
        if (this.state.thread != nextProps.thread) {
            this.setState({thread: nextProps.thread}, this.updateOtherPartyInfo)



        }
        if (this.state.user != nextProps.user) {
            this.setState({user: nextProps.user}, this.updateOtherPartyInfo)




        }

    };

    updateOtherPartyInfo () {
         if (this.state.thread.sender == this.state.user.id) {
                    var otherPartyName = this.state.thread.receiverName;
                    var otherPartyPhoto = s3ImageUrl + this.state.thread.receiverPhoto
                } else {
                    var otherPartyName = this.state.thread.senderName;
                    var otherPartyPhoto = s3ImageUrl + this.state.thread.senderPhoto
                }
                var theOtherParty = {name: otherPartyName, image: otherPartyPhoto};
                this.setState({otherParty: theOtherParty})

    }

    checkIfUser = () => {
        if (this.props.storeRoot) {
        if (this.props.storeRoot.user) {
            this.setState({
                user: this.props.storeRoot.user
            });
            this.updateOtherPartyInfo


        }
    }


    };





    handleClick = () => {
        this.props.click(this.state.thread)
    };

    handleLabelCloseClick = (closeLabelId) => {
        var labelsArray = this.state.thread.labels.slice();

                for(var i = labelsArray.length - 1; i >= 0; i--) {
                    if(labelsArray[i] == closeLabelId) {
                        labelsArray.splice(i, 1);
                    }
                }

                if (labelsArray.length != this.state.thread.labels.length) {

                    var newMessage = {
                        sender: 2,
                        receiver: 9,
                        labels: labelsArray,

                    };
                    $.ajax({
                        traditional: true,
                        url: "api/messageThreads/" + this.state.thread.id + "/",
                        dataType: 'json',
                        headers: {
                            'Authorization': 'Token ' + localStorage.token
                        },

                        type: 'PUT',
                        data: newMessage,

                        success: function () {
                        }.bind(this),
                        error: function (xhr, status, err) {
                            console.error("Error ", status, err.toString());
                        }.bind(this)
                    });
                }



    };

    handleLabelsListMenuClick = (theLabel) => {
        if (theLabel.myId != "newLabel") {
            var labelsArray = this.state.thread.labels.slice();
            if (!labelsArray.includes(theLabel.myId)) {
                labelsArray.push(theLabel.myId);

                var newMessage = {
                    sender: 2,
                    receiver: 9,
                    labels: labelsArray,

                };

                $.ajax({
                    traditional:true,
                    url: "api/messageThreads/" + this.state.thread.id + "/",
                    dataType: 'json',
                    headers: {
                        'Authorization': 'Token ' + localStorage.token
                    },

                    type: 'PUT',
                    data: newMessage,

                    success: function () {
                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error("Error ", status, err.toString());
                    }.bind(this)
                });

            }
        }
    };


    render() {




        return (
           <div className="messageThreadListItem" >
               <div className="ui grid">
                                  <div onClick={this.handleClick}>

                   <div className="ui row smallPadding absolutelyNoMargin">
                       <div className="ten wide column">

               <div><img className="ui avatar image" src={this.state.otherParty.image} /> <span>{this.state.otherParty.name}</span></div>
                           </div>
                       <div className="six wide column"></div>
                       </div>

                        <div className="ui row smallPadding absolutelyNoMargin">
                       <div className="ten wide column">
                <div>{this.props.thread.latestMessage}</div></div>
                            </div>
                                      </div>

                    <div className="ui row smallPadding">
                                               <div className="sixteen wide column">

               <MessageThreadItemLabelsList click={this.handleLabelsListMenuClick} closeClick={this.handleLabelCloseClick} labelsList={this.state.thread.labelsList} /></div></div>
                   </div>
               <div className="ui divider"></div>
                                      </div>

        )
    }


}

@connect(mapStateToProps, mapDispatchToProps)
export class ContactListPane extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            user:"",
            contacts: {},
            isVisible: true,
            currentContact:"",
            currentMessageThreadChannel:""

        }
    }

    componentDidMount() {
         if (this.props.storeRoot) {
            if (this.props.storeRoot.user) {

                this.setState({
                    user: this.props.storeRoot.user
                });
                this.setupMessageLoading

            }
            if (this.props.storeRoot.contacts) {
                this.setState({
                    contacts: this.props.storeRoot.contacts
                })
            }

            if (this.props.storeRoot.gui.currentContact != undefined) {
                        this.setState({
                            currentContact: this.props.storeRoot.gui.currentContact
                        })
                    }
        }
        this.setState({
            isVisible: this.props.isVisible
        });
        if (this.props.isVisible) {
            $(this.refs['ref_contactListPane']).show();

        } else {
            $(this.refs['ref_contactListPane']).hide();
        }
    }




    componentWillReceiveProps = (nextProps) => {
        if (nextProps.storeRoot) {
            if (nextProps.storeRoot.user) {
                this.setState({
                    user: nextProps.storeRoot.user
                });
                this.setupMessageLoading

            }

            if (nextProps.storeRoot.contacts) {
                this.setState({
                    contacts: nextProps.storeRoot.contacts
                })
            }

            /*if (nextProps.storeRoot.gui.currentContact) {
                this.setState({
                    currentContact: nextProps.storeRoot.gui.currentContact
                })

            }*/
            if ((this.state.currentContact != nextProps.storeRoot.gui.currentContact) && (nextProps.storeRoot.gui.currentContact != null)) {
                var contactId = nextProps.storeRoot.gui.currentContact.id;
                this.setState({
                    currentContact: nextProps.storeRoot.gui.currentContact
                }, this.getOrCreateThreadChannel(contactId))

            } else if (nextProps.storeRoot.gui.currentContact) {
                this.setState({
                    currentContact: nextProps.storeRoot.gui.currentContact
                })
            }
        }

            if (this.state.isVisible != nextProps.isVisible) {
                this.setState({isVisible: nextProps.isVisible});
                if (nextProps.isVisible) {
                    $(this.refs['ref_contactListPane']).show();

                } else {
                    $(this.refs['ref_contactListPane']).hide();
                }
            }


    };

    getOrCreateThreadChannel = (receiverId) => {
        if (receiverId != undefined ) {
            var theUrl = 'api/channelUsers/' + receiverId;
            $.ajax({
                method: 'GET',
                url: theUrl,
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    var theMessageThreadChannelLabel = data[0].label;
                    var theCurrentMessageThreadChannel = {
                        label: theMessageThreadChannelLabel,
                        id: data[0].id,
                        type: "chat-messages",

                    };
                    this.setState({currentMessageThreadChannel: theCurrentMessageThreadChannel},
                        this.createAndOrConnectToThread);
                    //console.log("theMessageThreadChannelLabel " + theMessageThreadChannelLabel)

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    return null
                }
            })
        }

    };

     createAndOrConnectToThread = () => {
        if (this.state.currentContact != "" & this.state.currentMessageThreadChannel != "") {
            this.sendNotificationToWakeupPrivateChannel(this.state.currentContact.notificationChannelLabel, this.state.currentMessageThreadChannel);

            this.connectToThread(this.state.currentMessageThreadChannel.id)


        }
    };

    sendNotificationToWakeupPrivateChannel = (receiverNotificationChannelLabel, privateChannel) => {
        //console.log("sendNotification to WakeupPrivateChannel " + receiverNotificationChannelLabel + " " + privateChannel)
        var receiverNotificationWebsocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/notifications/" + receiverNotificationChannelLabel + "/?token=" + localStorage.token);
        var notificationPrivateChannelWakeupMessage = {
            text: "openPrivateTextChannel",
            privateChannel: privateChannel.label,
            privateChannelId: privateChannel.id,
            typeOfMessage: "notifications",
            channel: receiverNotificationChannelLabel,
            token: localStorage.token,


        };

        receiverNotificationWebsocket.addEventListener('open', () => {
            receiverNotificationWebsocket.send(JSON.stringify(notificationPrivateChannelWakeupMessage));


        });

};






    setContacts = () => {
        if (this.props.storeRoot) {
            if (this.props.storeRoot.contacts) {
                this.setState({contacts: this.props.storeRoot.contacts})
            }
        }

    };

    contactItemClicked = (contact) => {
        //store.dispatch()
        this.getOrCreateThreadChannel(contact.id);
        //this.props.newThread(contact)
    };

    createNewMessageThread() {

        var theUrl = "api/messageThreads/";

        $.ajax({
            url: theUrl,
            dataType: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },

            type: 'POST',
            data: {
                receiver: this.props.storeRoot.gui.currentContact.id,
                sender: this.props.storeRoot.user.id,
                channel: this.state.currentMessageThreadChannel.id

            },

            success: function (messageThreadData) {
                messageThreadData.websocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat-messages/" + messageThreadData.channelLabel + "/?token=" + localStorage.token);
                store.dispatch(addThread(messageThreadData));
                store.dispatch(setCurrentThread(messageThreadData));

                this.setState({
                    //openThreads: this.state.openThreads.concat({messageThreadData}),
                    currentThread: messageThreadData,
                    currentReceiverNotificationChannelLabel: "",
                    currentMessageThreadChannel: "",
                    currentReceiver: "",
                });
                //store.dispatch(setOpenThreads(this.state.openThreads))

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this)
        });
    }


    connectToThread = (channelId) => {
        var theUrl = "api/channels/" + channelId + "/messageThread";
            $.ajax({
                method: 'GET',
                url: theUrl,
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (messageThreadData) {
                    if (messageThreadData.results[0]) {
                        var theMessageThreadData = messageThreadData.results[0];
                        theMessageThreadData.websocket = new ReconnectingWebSocket(ws_scheme + '://' + window.location.host + "/chat-messages/" + theMessageThreadData.channelLabel + "/?token=" + localStorage.token);
                        store.dispatch(addThread(theMessageThreadData));
                        store.dispatch(setCurrentThread(theMessageThreadData));
                        store.dispatch(addOpenThread(theMessageThreadData));
                        store.dispatch(setCurrentContact({}));

                        this.setState({

                            currentMessageThreadChannel: "",
                            currentReceiver: "",
                        })






                    } else {
                        this.createNewMessageThread()

                    }


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            })


    };

    render() {
        if (this.state.contacts != undefined) {

            var theData = this.state.contacts;
            var values = Object.keys(theData).map(function (key) {
                return theData[key];
            });
            var contactList = values.map((contact) => {
                if (contact.id != this.state.user.id) {
                    return (
                        <ContactItem key={`key_contactItem_${contact.id}`} contact={contact}
                                     contactItemClicked={this.contactItemClicked}/>
                    )
                }

            });


            return (

                <div ref="ref_contactListPane" className="contactListPane">
                    <ScrollArea className="contactListScrollArea"><Content autoScroll={false}
                                                                           messageList={contactList}/>
                    </ScrollArea>

                </div>
            );
        } else {
            return (<div></div>)

        }
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ContactItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this)

    }

    handleClick() {
        store.dispatch(setCurrentContact(this.props.contact));
        //this.props.contactItemClicked(this.props.contact)
    }


    render () {
        var imageUrl;

        if (this.props.profilePhoto != "") {

            imageUrl = s3ImageUrl + this.props.contact.profilePhoto
        }
        else {
            imageUrl = s3ImageUrl + "images/user.svg"
        }

        return (
            <div>
           <div className="contactItem" onClick={this.handleClick}>

               <img className="ui avatar image" src={imageUrl} /><span>{this.props.contact.firstName} {this.props.contact.lastName}</span></div>
               <div className="ui divider absolutelyNoMargin"></div>
            </div>
        )
    }
}


@connect(mapStateToProps, mapDispatchToProps)
export class MessageThreadPane extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            messagesData:{},
            channelMessages:[],
            messages: [],
            user: "",
            thread:"",
            isVisible:false,
            channelLabel:"",
            websocket:""

        };
        enableUniqueIds(this)
    }


    componentDidMount() {

        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.user != undefined) {
                this.setState({user: this.props.storeRoot.user})
            }
        }

        this.setState({
            thread:this.props.thread,
            websocket: this.props.thread.websocket,
            messages:this.props.thread.messages
        });



        if (this.props.isVisible) {
                $(this.refs['ref_messageThreadPane']).show();

            } else {
                $(this.refs['ref_messageThreadPane']).hide();
            }
        //this.setupMessageLoading()

    }

    componentWillReceiveProps = (nextProps ) => {
        if (nextProps.thread != undefined) {
            if (this.state.thread != nextProps.thread) {
                this.setState({
                    thread: nextProps.thread,
                });

                if (this.state.thread.websocket != undefined) {
                    this.setState({
                        websocket: nextProps.thread.websocket
                    })
                }
                if (nextProps.thread.messages != undefined) {
                    this.setState({
                        messages: nextProps.thread.messages
                    })
                }


            }
        }
        if (this.state.isVisible != nextProps.isVisible) {
            this.setState({isVisible:nextProps.isVisible});
            if (nextProps.isVisible) {
                $(this.refs['ref_messageThreadPane']).show();

            } else {
                $(this.refs['ref_messageThreadPane']).hide();
            }
        }

        if (nextProps.storeRoot != undefined) {
            if (this.state.user != nextProps.storeRoot.user) {
                this.setState({user: this.props.storeRoot.user})
            }
        }






    };




    /*setupMessageLoading = () => {
        var loadMessagesIntervalID = setInterval(this.loadMessagesFromServer, 800)
        this.setState({loadMessagesIntervalID:loadMessagesIntervalID})
    }*/

    /*
    loadMessagesFromServer = () => {


            $.ajax({
                url: "api/messageThreads/" + this.state.thread.id + "/messages",
                dataType: 'json',
                cache: false,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                        messagesData: data,
                        messages: this.state.messages.concat(data)
                    }, clearInterval(this.state.loadMessagesIntervalID))

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this),

            });


  }*/

   handleData(newMessageData) {
      let newMessage = JSON.parse(newMessageData);
       store.dispatch(addMessage(this.props.thread.id, newMessage));



       /*this.setState({
           channelMessages: this.state.channelMessages.concat(newMessage),
           messages:this.state.messages.concat(newMessage)

       })*/
      //this.setState({count: this.state.count + result.movement});
    }

  handleMessageSubmit (theMessageData) {
      var theUrl = "api/messages/";
      $.ajax({
        url: theUrl,
        dataType: 'json',
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },

        type: 'POST',
        data: theMessageData,

        success: function() {
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
        }.bind(this)
        });

  }
  render() {
            if (this.state.thread != undefined) {
                if (this.state.thread.channelLabel != undefined) {

                    var websocketUrl = ws_scheme + '://' + window.location.host + "/chat-messages/" + this.state.thread.channelLabel + "/?token=" + localStorage.token;
                    var theWebsocket = <Websocket url={websocketUrl} onMessage={this.handleData.bind(this)}/>


                }
            }


      if (this.state.messages != undefined) {

        //var theData = this.state.messages
        //var values = Object.keys(theData).map(function(key){
        //return theData[key];
        //});
        var messageList = this.state.messages.map((message) => {
            if (message.sender == this.state.user.id) {
                var theOrientation = "right"

            } else {
                var theOrientation = "left"
            }
            return (
                    <Message key={`key_message_${this.nextUniqueId()}`} messageText={message.text} receiverId={message.receiver} orientation={theOrientation} profilePhoto={this.state.user.profilePhoto} />
)

        })
    }


    return (
          <div ref="ref_messageThreadPane" className="messageThreadPane">
              {theWebsocket}

<ScrollArea className="messageScrollArea" verticalScrollbarStyle={verticalScrollbarStyle}><Content autoScroll={true} messageList={messageList} />
        </ScrollArea>
      </div>
    );
  }
}




export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],

        }
    }

    checkIfUser = () => {
        if (this.props.storeRoot) {
        if (this.props.storeRoot.user) {
            this.setState({
                user: this.props.storeRoot.user
            });
            this.setupMessageLoading


        }
    }


    };

    componentDidMount() {
        this.setState({
            data: this.props.data
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.data != nextProps.data) {
            this.setState({
                data: nextProps.data
            })
        }
    };

    render() {
        var messageList = [];
        var messageSenderArray = [];

        for (var i = 0; i < this.state.data.length - 1; i++) {


            var message = this.state.data[i];
            if (this.message.sender == this.state.user.id) {
                messageSenderArray[i] = true
            }

            var nextMessage = this.state.data[i + 1];
            if (nextMessage.sender != message.sender) {
                messageList.push(i)
            }
        }

        var messageShapes = [];

        messageShapes[0] = "roundedTop";
        for (var i = 1; i < this.state.data.length; i++) {
            messageShapes[i] = "";


            if (messageList.includes(i)) {
                messageShapes[i] = "roundedBottom";
                messageShapes[i + 1] = "roundedTop"
            }


        }

        var fullMessageStyles = [];
        for (var i = 0; i < this.state.data.length; i++) {
            fullMessageStyles[i] = {sender: messageSenderArray[i], shape: messageShapes[i]}
        }
        var messageListMarkup = "";
        for (var i = 0; i < this.state.data.length; i++) {

            var message = this.state.data[i];
            var messageMarkup = <Message key={message.id} style={fullMessageStyles[i]} messageText={message.text}
                                         receiverId={message.receiver} orientation={theOrientation}
                                         profilePhoto={this.state.user.profilePhoto}/>;
            messageListMarkup = messageListMarkup + messageMarkup

        }

        return (
            <div>
                {messageListMarkup}
            </div>
        )


    }
}



class Content extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            messageList:[],
            messageListCount:"",

        }
    }


    componentDidUpdate = () => {
        window.requestAnimationFrame(() => {
    if (this !== undefined) {
      //and scroll them!
      //this.context.scrollArea.scrollBottom()
    }
  });
    };

    componentDidMount = () => {
        this.setState({
            messageList: this.props.messageList
        })

    };
    shouldScrollToBottom() {
        if (this.state.messageList != undefined) {
            if (this.state.messageList.length != this.state.messageListCount) {
                this.setState({
                    messageListCount: this.state.messageList.length
                });

                if (this.props.autoScroll) {
                    this.context.scrollArea.scrollBottom()
                }
            }
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.messageList != nextProps.messageList) {
            this.setState({
            messageList: this.props.messageList
        }, () => { this.shouldScrollToBottom() })


        }

    };


render(){


        return (
            <div className="scrollAreaContent">
                {this.props.messageList}
            </div>
        )
    }
}


export class NewLabelModal extends ChoiceModal {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            modalIsOpen: false,
            inputText:"",
            editable:true,
        }
    }
    closeModal = () => {
            this.setState({
                modalIsOpen: false,
            })

    };

    handleInputTextChange = (value) => {
        //if (validator.isEmail(e.target.value)) {
        //} else {
            this.setState({title: value});

        //}
    };

    render() {
        return (<Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customModalStyles} >
            <div className="ui grid">
                <div className="right floated column noPaddingBottom ">
                <div className="ui right floated button absolutelyNoMargin" onClick={this.closeModal}><i className="large remove icon button "></i></div>
                    </div>
                </div>

            <div className="ui center aligned grid">
                    <div className="ten wide column noPaddingTop noPaddingBottom">
                        <div className="left aligned header  "><h2>{this.props.header}</h2></div>
                    </div>
                    <div className="ui row">
                        <div className="ten wide column noPaddingTop">
                            <div className="leftAligned" >{this.props.description}</div>
                        </div>
                        </div>
                <div className="ui row">
                    <div className="eight wide column">

                        <ValidatedInput type="text"
                                        name="labelName"
                                        label="Label"
                                        id="id_labelName"
                                        placeholder=""
                                        value={this.state.inputText}
                                        initialValue={this.state.inputText}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleInputTextChange}
                                        isDisabled={! this.state.editable} />
                        </div>
                </div>
                    <div className="row"><div className="eight wide column">

                        <ChoiceModalButtonsList buttons={this.props.buttons} click={this.handleClick} />
                        </div></div>
                    </div>


            </Modal>
    )
    }

}


Content.contextTypes = {
    scrollArea: PropTypes.object
};

module.exports = { MessageThreadPane, MessagePage, NewLabelModal, MessageWindowContainer};