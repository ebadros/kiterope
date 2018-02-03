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

import { setCurrentUser, setPlans,  setUpdateOccurrences, setUpdates, setVisualizations, removeStepFromUpdate, addStepToUpdate, editUpdate, reduxLogout, setProfile, setSettings, setForMobile, showSidebar, setContacts, setMessageWindowVisibility, setOpenThreads, setGoals, setPrograms, setMessageThreads,  setStepOccurrences } from './redux/actions'
import {convertDate, convertFromDateString, daysBetweenDates, daysBetween} from './dateConverter'

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




// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

var UpdatesList = require('./update');

import { theServer, s3IconUrl, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from './constants'

import { Provider, connect, dispatch } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import  {store} from "./redux/store"
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {REHYDRATE} from 'redux-persist/constants'
import {  mapStateToProps, mapDispatchToProps } from './redux/containers2'



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
export default class ReduxDataGetter extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            width:'0',
            height:'0',
            userDataLoaded:false,
            profileDataLoaded:false,
            settingsDataLoaded:false,
            goalDataLoaded:false,
            planDataLoaded:false,
            programDataLoaded: false,
            contactDataLoaded:false,
            stepOccurrenceDataLoaded:false,
            updateOccurrenceDataLoaded:false,
            updateDataLoaded:false,
            messageThreadDataLoaded:false,
            rehydrated:false



        }

    }

    componentDidMount = () => {

        store.dispatch(setMessageWindowVisibility(false));
          this.updateWindowDimensions();
          window.addEventListener('resize', this.updateWindowDimensions);


        persistStore(store, {blacklist: ['routing', 'gui']}, () => {
      this.setState({rehydrated: true}, () => {this.getAllData()})


    })
    };
    getAllData() {
        var intervalID = setInterval(this.loadUserData, 2000);
        this.setState({intervalID: intervalID})
    }



    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
            if (this.state.intervalID != undefined) {
                clearInterval(this.state.intervalID);

        }
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
        if (!this.state.userDataLoaded) {
            var theUrl = '/api/users/i/';
            $.ajax({
                method: 'GET',
                url: theUrl,
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (userData) {
                    this.setState({userDataLoaded:true})
                    store.dispatch(setCurrentUser(userData));

                    if (userData.id != null) {
                         if (userData.isCoach) {
                            this.loadCoachSpecificData()

                        }
                        this.loadUniversalData();


                    }

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            })
        }
    }



    loadProfileData() {
                if (!this.state.profileDataLoaded) {

                    var theUrl = '/api/profiles/me/';
                    $.ajax({
                        method: 'GET',
                        url: theUrl,
                        datatype: 'json',
                        headers: {
                            'Authorization': 'Token ' + localStorage.token
                        },
                        success: function (profileData) {
                    this.setState({profileDataLoaded:true})
                            store.dispatch(setProfile(profileData));


                        }.bind(this),
                        error: function (xhr, status, err) {
                            console.error(theUrl, status, err.toString());
                        }
                    })
                }

    }

    loadSettingsData() {
                    if (!this.state.settingsDataLoaded) {


                        var theUrl = '/api/settings/me/';
                        $.ajax({
                            method: 'GET',
                            url: theUrl,
                            datatype: 'json',
                            headers: {
                                'Authorization': 'Token ' + localStorage.token
                            },
                            success: function (settingsData) {
                                                    this.setState({settingsDataLoaded:true})


                                store.dispatch(setSettings(settingsData));


                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error(theUrl, status, err.toString());
                            }
                        })
                    }
    }

    setUsersTimezone(userProfileId) {
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
        this.loadStepOccurrenceData();

        this.loadGoalData();
        this.loadPlanData();
        this.loadUpdateOccurrenceData();
        this.loadVisualizationData();


        this.loadProfileData();
        this.loadSettingsData();
        //this.loadMessageThreadData();
        this.loadContactData();
        if(this.props.storeRoot.user) {

            this.setUsersTimezone(this.props.storeRoot.user.profileId)
        }

    }



    loadCoachSpecificData() {

        this.loadProgramData()
        this.loadUpdateData()

    }

    loadUpdateData() {
                    if (!this.state.updateDataLoaded) {


                        var theUrl = "/api/updates/";
                        $.ajax({
                            url: theUrl,
                            dataType: 'json',
                            cache: false,
                            headers: {
                                'Authorization': 'Token ' + localStorage.token
                            },
                            success: function (data) {
                                                    this.setState({updateDataLoaded:true})


                                store.dispatch(setUpdates(data))

                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error(theUrl, status, err.toString());

                            }.bind(this),

                        });
                    }

    }

    loadGoalData() {
                    if (!this.state.goalDataLoaded) {


                        var theUrl = "/api/goals/";
                        $.ajax({
                            url: theUrl,
                            dataType: 'json',
                            cache: false,
                            headers: {
                                'Authorization': 'Token ' + localStorage.token
                            },
                            success: function (data) {
                                                    this.setState({goalDataLoaded:true})


                                store.dispatch(setGoals(data))

                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error(theUrl, status, err.toString());

                            }.bind(this),

                        });
                    }

    }

    loadPlanData() {
                    if (!this.state.planDataLoaded) {


                        var theUrl = "/api/planOccurrences/";
                        $.ajax({
                            url: theUrl,
                            dataType: 'json',
                            cache: false,
                            headers: {
                                'Authorization': 'Token ' + localStorage.token
                            },
                            success: function (data) {
                                                    this.setState({planDataLoaded:true})


                                store.dispatch(setPlans(data))

                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error(theUrl, status, err.toString());

                            }.bind(this),

                        });
                    }

    }

    loadProgramData() {
                    if (!this.state.programDataLoaded) {



                        var theUrl = "/api/programs/";
                        $.ajax({
                            url: theUrl,
                            dataType: 'json',
                            cache: false,
                            headers: {
                                'Authorization': 'Token ' + localStorage.token
                            },
                            success: function (data) {
                                                    this.setState({programDataLoaded:true})


                                store.dispatch(setPrograms(data))

                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error(theUrl, status, err.toString());

                            }.bind(this),

                        });
                    }
    }

    loadMessageThreadData (){
            if (!this.state.messageThreadDataLoaded) {




                //sb.connect('eric@kiterope.com', '06acb152950c651a173c7c4425856ef7317281d3', function(user, error) {});


                var theUrl = '/api/messageThreads/';

                $.ajax({
                    url: theUrl,
                    dataType: 'json',
                    cache: false,
                    headers: {
                        'Authorization': 'Token ' + localStorage.token
                    },
                    success: function (data) {
                                            this.setState({messageThreadDataLoaded:true})


                        store.dispatch(setMessageThreads(data));
                        store.dispatch(setOpenThreads({}))


                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.error(theUrl, status, err.toString());
                    }.bind(this),

                });
            }
  }



    loadStepOccurrenceData() {
        if (!this.state.stepOccurrenceDataLoaded && this.props.stepOccurrences == undefined) {


            var periodRangeStart = new Date();
            var periodRangeEnd = new Date();
            periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
            periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
            var theUrl = "/api/period/" + periodRangeStart + "/" + periodRangeEnd + "/" ;

            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                                        this.setState({stepOccurrenceDataLoaded:true})


                    store.dispatch(setStepOccurrences(data))

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });
        }


    }

    loadUpdateOccurrenceData() {
        if (!this.state.updateOccurrenceDataLoaded) {



            var theUrl = "/api/updateOccurrences/"
            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.formatUpdateOccurrenceData(data)
                    this.setState({updateOccurrenceDataLoaded:true})



                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });
        }


    }

    formatUpdateOccurrenceData(theUpdateOccurrences) {
        console.log("formatUpdateOccurrenceData")
            var theData = []
            var uniqueStepOccurrenceIds = []

            for (var i=0; i < theUpdateOccurrences.length; i++) {

                //Compile all unique step occurrences
                var theStepOccurrenceId = theUpdateOccurrences[i].stepOccurrence

                if (uniqueStepOccurrenceIds.indexOf(theStepOccurrenceId) < 0) {
                                        uniqueStepOccurrenceIds.push(theStepOccurrenceId)

                }

            }


            for (var i=0; i < uniqueStepOccurrenceIds.length; i++) {
                var theStepOccurrenceId = uniqueStepOccurrenceIds[i]
                                    var theStepOccurrenceSetOfData = {}

                for (var j=0; j < theUpdateOccurrences.length; j++) {
                    var theCurrentUpdateOccurrence = theUpdateOccurrences[j]
                    var theCurrentUpdateOccurrenceStepId = theCurrentUpdateOccurrence.stepOccurrence
                    if (theStepOccurrenceId == theCurrentUpdateOccurrenceStepId) {
                        var measuringWhat = theCurrentUpdateOccurrence.update.measuringWhat
                        var theFormat = theCurrentUpdateOccurrence.update.format
                        if (theFormat == 'datetime') {
                             var theConvertedTime = convertDate(theCurrentUpdateOccurrence[theFormat], 0, "dateFormat", "absoluteTime")
                            var updateOccurrenceValue = theConvertedTime

                        } else {
                            var updateOccurrenceValue = theCurrentUpdateOccurrence[theFormat]

                        }


                        theStepOccurrenceSetOfData[measuringWhat] = updateOccurrenceValue

                    }
                }
                theData.push(theStepOccurrenceSetOfData)



            }
                                store.dispatch(setUpdateOccurrences(theData))



    }


    loadContactData()
        {
            if (!this.state.contactDataLoaded) {


            var theUrl = "/api/contacts/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                                        this.setState({contactDataLoaded:true})


                    this.organizeContacts(data)

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());

                }.bind(this),

            });


        }
    }

    loadVisualizationData()
        {
            if (!this.state.visualizationDataLoaded) {


            var theUrl = "/api/visualizations/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({visualizationDataLoaded:true})
                    store.dispatch(setVisualizations(data))



                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());

                }.bind(this),

            });


        }
    }

    organizeContacts(theContactData) {
        var theContacts = {};
            if (this.props.user) {
                for (var key in theContactData) {
                    if (theContactData[key].receiverProfile.user == this.props.user.id) {
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

    render() {
        if (!this.state.rehydrated) {
            return (<div>Loading...</div>)

        } else {
            return (<div></div>)
        }


    }

}
